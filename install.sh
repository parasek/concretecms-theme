#!/usr/bin/env bash
set -e

# NO_CONCRETE / PURGE
# Parse command-line arguments
# Looking for "--no-concrete" and "--purge"
NO_CONCRETE=false
PURGE=false
for arg in "$@"; do
    case $arg in
        --no-concrete)
            NO_CONCRETE=true
            shift
            ;;
        --purge)
            PURGE=true
            shift
            ;;
        *)
            # Pass through other args
            ;;
    esac
done
export NO_CONCRETE
export PURGE

# INSTALL_SCRIPT_EXECUTED
# Concrete installation will only run when invoked via "./install.sh".
# Running "docker compose up" will not trigger installation in the workspace entrypoint.
export INSTALL_SCRIPT_EXECUTED=true

# READY_MSG
# String that signals when to stop following workspace logs. Used in this script and in entrypoint.sh.
export READY_MSG="✅ Workspace ready"

# Prevent using --purge and --no-concrete together
if [ "${PURGE}" = "true" ] && [ "${NO_CONCRETE}" = "true" ]; then
    echo "❌ Installation aborted. The --purge and --no-concrete options cannot be used together."
    exit 1
fi

# Confirm before proceeding
if [ "${NO_CONCRETE}" = "true" ]; then
    echo "Are you sure you want to build and run the containers without installing Concrete CMS?"
else
    echo "Are you sure you want to install a fresh Concrete CMS site?"
fi

if [ "${PURGE}" = "true" ]; then
    RED='\033[0;31m'
    RESET='\033[0m'
    printf "⚠️ WARNING: The database and certain folders (e.g. public/application/files, vendor, node_modules) will be ${RED}PERMANENTLY DELETED${RESET}\n"
    echo -n "Type purge to confirm: "
    read -r CONFIRMATION
    # Accept "purge" case-insensitive
    CONFIRMATION_LOWER=$(printf '%s' "$CONFIRMATION" | tr '[:upper:]' '[:lower:]')
    if [ "$CONFIRMATION_LOWER" != "purge" ]; then
        echo "❌ Installation aborted by user."
        exit 1
    fi
else
    echo -n "Type yes (y) to confirm: "
    read -r CONFIRMATION
    CONFIRMATION_LOWER=$(printf '%s' "$CONFIRMATION" | tr '[:upper:]' '[:lower:]')
    if [ "$CONFIRMATION_LOWER" != "yes" ] && [ "$CONFIRMATION_LOWER" != "y" ]; then
        echo "❌ Installation aborted by user."
        exit 1
    fi
fi

# Check if "public/concrete" exists (indicates Concrete is already installed)
if [ "${PURGE}" != "true" ] && [ -d "public/concrete" ]; then
    echo "⚠️ Folder \"public/concrete\" already exists - Concrete is most likely already installed."
    echo "To reinstall Concrete, rerun the command with the --purge flag."
    exit 1
fi

echo "🛑 Stopping and removing containers, networks, and Docker-managed volumes..."
# Remove containers, networks and Docker-managed volumes (-v)
# Host-managed volumes (e.g. ./db) are not removed by "docker compose down"
docker compose down -v

if [ "${PURGE}" = "true" ] && [ "${NO_CONCRETE}" != "true" ]; then

    echo "🗑️ Removing folders and files created by a fresh Concrete CMS installation (vendor, db, files, config, etc.)..."
    sudo rm -rf .git
    sudo rm -rf db
    sudo rm -rf node_modules
    sudo rm -rf vendor
    sudo rm -rf public/concrete
    sudo rm -rf public/application/config/doctrine/*
    sudo rm -rf public/application/config/generated_overrides/*
    sudo rm -f public/application/config/database.php
    find public/application/files -mindepth 1 -maxdepth 1 ! -name 'index.html' -exec rm -rf {} \;

    # If installation was interrupted before reverting the rename, force restore it
    mv -f public/application/config/temp.database.php public/application/config/live.database.php 2>/dev/null || true

fi

echo "🔨 Rebuilding Docker containers (docker compose build --no-cache)..."
docker compose build --no-cache

echo "▶️ Starting Docker services in the background (docker compose up -d)..."
docker compose up -d

echo "🔍 Following workspace logs until installation finishes (will exit automatically)..."
docker compose logs -f workspace 2>&1 | awk -v pat="$READY_MSG" '{ print; if (index($0, pat)) { fflush(); exit } }'

echo "📦 Installing packages from package-lock.json (npm ci)..."
docker compose exec -T workspace bash -lc "cd /var/www/html && npm ci"

echo "📦 Building frontend assets (CSS, JS, image minification, etc.)..."
docker compose exec -T workspace bash -lc "cd /var/www/html && npm run build"

echo "🧾 Initializing Git repository and making the initial commit..."
sudo -u "$SUDO_USER" git init
sudo -u "$SUDO_USER" git add .
sudo -u "$SUDO_USER" git commit -m "Initial commit"
sudo -u "$SUDO_USER" git branch -M main

echo "💻 Entering the workspace..."
docker compose exec workspace bash
