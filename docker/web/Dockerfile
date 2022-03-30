ARG APP_PHP_VERSION

FROM php:${APP_PHP_VERSION}-apache

RUN a2enmod rewrite

RUN a2enmod ssl

RUN apt-get update && apt-get install -y git unzip zip sudo wget nano

WORKDIR /var/www/html

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions gd pdo_mysql bcmath zip intl opcache

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Install node
# https://github.com/nodesource/distributions/blob/master/README.md
# Example versions: setup_current.x, setup_lts.x, setup_16.x
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

# Install sass
RUN npm install --save-dev sass
