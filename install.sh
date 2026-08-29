#!/usr/bin/env bash
set -e

# EMPTY_PROJECT / PURGE
# Parse command-line arguments
# Looking for "--empty" and "--purge"
EMPTY_PROJECT=false
PURGE=false
for arg in "$@"; do
    case $arg in
        --empty)
            EMPTY_PROJECT=true
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
export EMPTY_PROJECT
export PURGE

APP_PHP_VERSION_VALUE=$(docker compose config --environment | sed -n 's/^APP_PHP_VERSION=//p' | tail -n 1)
if [ -z "${APP_PHP_VERSION_VALUE}" ]; then
    echo "❌ Installation aborted. APP_PHP_VERSION is not configured in .env."
    exit 1
fi

COMPOSE_COMMAND=(docker compose)
PHP_CS_FIXER_VERSION='^3.0'
case "${APP_PHP_VERSION_VALUE}" in
5.6)
    PHP_CS_FIXER_VERSION='^2.19'
    if [ "${EMPTY_PROJECT}" != "true" ]; then
        echo "❌ Installation aborted. PHP 5.6 is only supported for empty projects. Run ./install.sh --empty."
        exit 1
    fi

    COMPOSE_COMMAND+=(
        -f compose.yaml
        -f docker/legacy/5.6/compose.override.yaml
    )
    ;;
7.0|7.1|7.2|7.3|7.4)
    if [ "${APP_PHP_VERSION_VALUE}" != "7.4" ]; then
        PHP_CS_FIXER_VERSION='^2.19'
    fi

    if [ "${EMPTY_PROJECT}" != "true" ]; then
        echo "❌ Installation aborted. PHP ${APP_PHP_VERSION_VALUE} is only supported for empty projects. Run ./install.sh --empty."
        exit 1
    fi

    COMPOSE_COMMAND+=(
        -f compose.yaml
        -f docker/legacy/7/compose.override.yaml
    )
    ;;
8.0|8.1|8.2|8.3)
    if [ "${EMPTY_PROJECT}" != "true" ]; then
        echo "❌ Installation aborted. PHP ${APP_PHP_VERSION_VALUE} is only supported for empty projects. Current Concrete CMS projects require PHP 8.4 or newer."
        exit 1
    fi
    ;;
8.*)
    ;;
*)
    echo "❌ Installation aborted. APP_PHP_VERSION must be 5.6, PHP 7.0–7.4, or a PHP 8.x version."
    exit 1
    ;;
esac

# INSTALL_SCRIPT_EXECUTED
# Concrete installation will only run when invoked via "./install.sh".
# Running "docker compose up" will not trigger installation in the workspace entrypoint.
export INSTALL_SCRIPT_EXECUTED=true

# READY_MSG
# String that signals when to stop following workspace logs. Used in this script and in entrypoint.sh.
export READY_MSG="✅ Workspace ready"

# Prevent using --purge and --empty together
if [ "${PURGE}" = "true" ] && [ "${EMPTY_PROJECT}" = "true" ]; then
    echo "❌ Installation aborted. The --purge and --empty options cannot be used together."
    exit 1
fi

# Confirm before proceeding
if [ "${EMPTY_PROJECT}" = "true" ]; then
    echo "⚠️ Empty-project mode permanently removes the Concrete CMS skeleton, frontend assets, source code, tests, dependencies, and all existing public files."
    echo "The project will use PHP ${APP_PHP_VERSION_VALUE}."
    echo -n "Type empty to confirm: "
    read -r CONFIRMATION
    CONFIRMATION_LOWER=$(printf '%s' "$CONFIRMATION" | tr '[:upper:]' '[:lower:]')
    if [ "$CONFIRMATION_LOWER" != "empty" ]; then
        echo "❌ Installation aborted by user."
        exit 1
    fi
else
    echo "Are you sure you want to install a fresh Concrete CMS site?"

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
fi

# Check if "public/concrete" exists (indicates Concrete is already installed)
if [ "${EMPTY_PROJECT}" != "true" ] && [ "${PURGE}" != "true" ] && [ -d "public/concrete" ]; then
    echo "⚠️ Folder \"public/concrete\" already exists - Concrete is most likely already installed."
    echo "To reinstall Concrete, rerun the command with the --purge flag."
    exit 1
fi

echo "🛑 Stopping and removing containers, networks, and Docker-managed volumes..."
# Remove containers, networks and Docker-managed volumes (-v)
# Host-managed volumes (e.g. ./db) are not removed by "docker compose down"
"${COMPOSE_COMMAND[@]}" down -v

if [ "${EMPTY_PROJECT}" = "true" ]; then
    echo "🧹 Removing the Concrete CMS skeleton and creating minimal project manifests..."
    sudo rm -rf assets src tests node_modules vendor
    sudo rm -f composer.lock package-lock.json webpack.config.cjs
    sudo rm -f phpunit.xml.dist
    sudo find public -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +

    PROJECT_OWNER=${SUDO_USER:-$(id -un)}
    sudo -u "${PROJECT_OWNER}" tee public/index.php >/dev/null <<'PHP'
<?php

echo 'Hello world!';
PHP

    sudo -u "${PROJECT_OWNER}" tee composer.json >/dev/null <<JSON
{
    "name": "project/application",
    "description": "An empty PHP project.",
    "type": "project",
    "license": "MIT",
    "require": {
        "php": "^${APP_PHP_VERSION_VALUE}"
    },
    "require-dev": {
        "friendsofphp/php-cs-fixer": "${PHP_CS_FIXER_VERSION}"
    },
    "scripts": {
        "fix": "php-cs-fixer fix"
    }
}
JSON

    sudo -u "${PROJECT_OWNER}" tee package.json >/dev/null <<'JSON'
{
    "name": "application",
    "version": "1.0.0",
    "private": true,
    "type": "module",
    "scripts": {
        "eslint": "eslint .",
        "eslint:fix": "eslint . --fix",
        "prettier": "prettier . --check",
        "prettier:fix": "prettier . --write"
    },
    "devDependencies": {
        "@eslint/js": "^8.57.1",
        "eslint": "^8.57.1",
        "eslint-config-prettier": "^10.1.8",
        "prettier": "^3.7.4"
    }
}
JSON
elif [ "${PURGE}" = "true" ]; then

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
"${COMPOSE_COMMAND[@]}" build --no-cache

echo "▶️ Starting Docker services in the background (docker compose up -d)..."
"${COMPOSE_COMMAND[@]}" up -d

echo "🔍 Following workspace logs until installation finishes (will exit automatically)..."
"${COMPOSE_COMMAND[@]}" logs -f workspace 2>&1 | awk -v pat="$READY_MSG" '{ print; if (index($0, pat)) { fflush(); exit } }'

if [ "${EMPTY_PROJECT}" = "true" ]; then
    echo "📦 Installing frontend development packages (npm install)..."
    "${COMPOSE_COMMAND[@]}" exec -T workspace bash -lc "cd /var/www/html && npm install"
else
    echo "📦 Installing packages from package-lock.json (npm ci)..."
    "${COMPOSE_COMMAND[@]}" exec -T workspace bash -lc "cd /var/www/html && npm ci"

    echo "📦 Building frontend assets (CSS, JS, image minification, etc.)..."
    "${COMPOSE_COMMAND[@]}" exec -T workspace bash -lc "cd /var/www/html && npm run build"
fi

echo "🧾 Initializing Git repository and making the initial commit..."
sudo -u "$SUDO_USER" git init
sudo -u "$SUDO_USER" git add .
sudo -u "$SUDO_USER" git commit -m "Initial commit"
sudo -u "$SUDO_USER" git branch -M main

echo "💻 Entering the workspace..."
"${COMPOSE_COMMAND[@]}" exec workspace bash
