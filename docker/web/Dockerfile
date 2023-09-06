ARG APP_PHP_VERSION

FROM php:${APP_PHP_VERSION}-apache

RUN a2enmod rewrite

RUN a2enmod ssl

RUN apt-get update

WORKDIR /var/www/html

# Install PHP extensions using mlocati installer
# https://github.com/mlocati/docker-php-extension-installer#usage
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions
RUN install-php-extensions gd pdo_mysql zip bcmath intl
