ARG APP_PHP_VERSION

FROM php:${APP_PHP_VERSION}-apache

RUN a2enmod rewrite

RUN a2enmod ssl

RUN apt-get update

WORKDIR /var/www/html

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions gd pdo_mysql bcmath zip intl opcache
