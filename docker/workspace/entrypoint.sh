#!/usr/bin/env bash
set -e

echo "🚀 Starting the workspace..."

# ─────────────────────────────────────
# ⏳ Database check
# ─────────────────────────────────────

echo "⏳ Waiting for the database to become available..."
RETRIES=20
until php -r "
try {
    new PDO('mysql:host=${DB_HOSTNAME};dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}');
    exit(0);
} catch (Exception \$e) {
    exit(1);
}
"; do
    echo "⏳ Database not ready yet — retrying..."
    sleep 3
    ((RETRIES--))
    if [ $RETRIES -le 0 ]; then
        echo "❌ Could not connect to the database — aborting."
        exit 1
    fi
done

echo "✅ Database is ready"

# ─────────────────────────────────────
# 📦 Dependency and Concrete CMS installation
# ─────────────────────────────────────

# Set INSTALL_SCRIPT_EXECUTED to "false" if unset or empty
: "${INSTALL_SCRIPT_EXECUTED:=false}"

# Install Composer dependencies only when triggered by "./install.sh".
if [ "${INSTALL_SCRIPT_EXECUTED:-}" = "true" ]; then

    echo "📦 Running Composer install (composer install --no-interaction --prefer-dist)..."
    composer install --no-interaction --prefer-dist --optimize-autoloader || {
        echo "❌ Composer install failed"; exit 1;
    }

    # Concrete CMS installation is not part of an empty project.
    if [ "${EMPTY_PROJECT:-false}" != "true" ]; then

        # Temporarily rename live.database.php (installation won't start otherwise)
        mv public/application/config/live.database.php public/application/config/temp.database.php

        echo "🛠️ Installing Concrete CMS..."
        php ./vendor/bin/concrete5 c5:install \
        --db-server="${DB_HOSTNAME}" \
        --db-username="${DB_USERNAME}" \
        --db-password="${DB_PASSWORD}" \
        --db-database="${DB_DATABASE}" \
        --starting-point="${INSTALL_STARTING_POINT}" \
        --site="${INSTALL_SITE_NAME}" \
        --language="${INSTALL_LANGUAGE}" \
        --site-locale="${INSTALL_SITE_LOCALE}" \
        --timezone="${APP_TZ}" \
        --admin-email="${INSTALL_ADMIN_EMAIL}" \
        --admin-password="${INSTALL_ADMIN_PASSWORD}" || {
            echo "❌ Concrete CMS installation failed."; exit 1;
        }

        # Revert rename of live.database.php (Concrete will use live.database.php again)
        mv public/application/config/temp.database.php public/application/config/live.database.php

        # Remove the original database.php file
        rm public/application/config/database.php

        echo "📄 Generating IDE support files..."
        php ./vendor/bin/concrete5 c5:ide-symbols

        echo "🧹 Clearing cache..."
        rm -rf public/application/files/cache/*

    fi

fi

# ─────────────────────────────────────
# ✅ Signal readiness
# ─────────────────────────────────────
echo "${READY_MSG}"

exec "$@"
