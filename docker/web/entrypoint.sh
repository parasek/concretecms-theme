#!/usr/bin/env bash
set -euo pipefail

CONF=/etc/apache2/sites-available/000-default.conf
EXAMPLE=/etc/apache2/sites-available/000-default.conf.example

# If file is missing, copy automatically (don't overwrite an existing one)
if [[ ! -f "$CONF" && -f "$EXAMPLE" ]]; then
  echo "🔧 Copying $EXAMPLE to $CONF..."
  # Install creates the file with reasonable permissions; cp -n is an alternative
  install -m 0644 "$EXAMPLE" "$CONF"
fi

# Activate site only if the config file exists
if [[ -f "$CONF" ]]; then
  if command -v a2ensite >/dev/null 2>&1; then
    a2ensite 000-default.conf || true
  else
    echo "⚠️ a2ensite not found; skipping site enable"
  fi
else
  echo "⚠️ Apache config $CONF not found; skipping a2ensite"
fi

# Start Apache as PID 1 (use exec so signals reach apache)
echo "▶️ Starting Apache..."
exec apache2-foreground
