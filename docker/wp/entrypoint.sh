#!/usr/bin/env bash
set -euo pipefail

WP_PATH="/var/www/html"
WP_DB_HOST="${WP_DB_HOST:-db_wp}"
WP_URL="${WP_URL:-http://localhost:8080}"

export WP_CLI_ALLOW_ROOT=1

wp() {
  php -d memory_limit=256M /usr/local/bin/wp "$@"
}

echo "[wp-entrypoint] Waiting for database at ${WP_DB_HOST}..."
until mysqladmin ping -h "${WP_DB_HOST}" -u root -p"${MYSQL_ROOT_PASSWORD}" --silent; do
  sleep 2
  echo "[wp-entrypoint] Still waiting for database..."
done

echo "[wp-entrypoint] Database is up. Preparing WordPress..."

if [ ! -f "${WP_PATH}/wp-includes/version.php" ]; then
  wp core download --path="${WP_PATH}" --force
fi

if [ ! -f "${WP_PATH}/wp-config.php" ]; then
  wp config create \
    --path="${WP_PATH}" \
    --dbname="${MYSQL_DATABASE}" \
    --dbuser="${MYSQL_USER}" \
    --dbpass="${MYSQL_PASSWORD}" \
    --dbhost="${WP_DB_HOST}" \
    --skip-check \
    --extra-php <<'PHP'
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('GRAPHQL_DEBUG', true);
PHP
fi

if ! wp core is-installed --path="${WP_PATH}"; then
  wp core install \
    --path="${WP_PATH}" \
    --url="${WP_URL}" \
    --title="${WP_TITLE}" \
    --admin_user="${WP_ADMIN_USER}" \
    --admin_password="${WP_ADMIN_PASSWORD}" \
    --admin_email="${WP_ADMIN_EMAIL}" \
    --skip-email
fi

wp option update home "${WP_URL}" --path="${WP_PATH}"
wp option update siteurl "${WP_URL}" --path="${WP_PATH}"

if ! wp plugin is-installed wp-graphql --path="${WP_PATH}"; then
  wp plugin install wp-graphql --activate --path="${WP_PATH}"
else
  wp plugin activate wp-graphql --path="${WP_PATH}"
fi

if wp theme is-installed headless --path="${WP_PATH}"; then
  wp theme activate headless --path="${WP_PATH}"
fi

wp rewrite structure '/%postname%/' --hard --path="${WP_PATH}"
wp rewrite flush --hard --path="${WP_PATH}"

chown -R www-data:www-data "${WP_PATH}/wp-content"

exec /usr/local/sbin/php-fpm -F -R
