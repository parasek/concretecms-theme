#!/usr/bin/env bash
set -e

# Ensure proper ownership (Block Builder generates files inside block folder).
# 2 in 2775 flag: Files and subdirectories created inside inherit the directory’s group ownership
TARGET_DIR="/var/www/html/public/application/blocks"

chown -R "${UID-1000}:${GID-1000}" "${TARGET_DIR}"
find "${TARGET_DIR}" -type d -exec chmod 2775 {} +
find "${TARGET_DIR}" -type f -exec chmod 664 {} +

exec "$@"
