ARG APP_PHP_VERSION

FROM php:${APP_PHP_VERSION}-apache

RUN a2enmod rewrite

RUN a2enmod ssl

RUN apt-get update && apt-get install -y git unzip zip sudo wget nano

WORKDIR /var/www/html

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions gd pdo_mysql bcmath zip intl opcache

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Install Xdebug
# Based on: https://matthewsetter.com/setup-step-debugging-php-xdebug3-docker/
# Remebember to install browser extension like "Xdebug helper" for Chrome.
#RUN pecl install xdebug \
#    && docker-php-ext-enable xdebug

# Install Node.js
# https://github.com/nodesource/distributions/blob/master/README.md
# Example versions: setup_current.x, setup_lts.x, setup_18.x
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
RUN apt-get install -y nodejs

# Install Gulp globally
# You will be able to run Gulp tasks in docker container.
RUN npm install --global gulp-cli

# Install libraries required for generating critical CSS (Penthouse/Puppeteer)
# https://github.com/puppeteer/puppeteer/issues/404#issuecomment-323555784
RUN apt-get install -y libpangocairo-1.0-0 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libatk1.0-0 libgtk-3-0
