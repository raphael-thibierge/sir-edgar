#!/bin/sh


composer install --no-dev
# php artisan migrate
php artisan config:cache
php artisan route:cache

set -e

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
	set -- php-fpm "$@"
fi

exec "$@"