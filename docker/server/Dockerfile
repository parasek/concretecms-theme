FROM php:8.0-apache

RUN a2enmod rewrite

RUN a2enmod ssl

RUN apt-get update && apt-get install -y git unzip zip sudo wget nano

WORKDIR /var/www/html

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions gd pdo_mysql bcmath zip intl opcache

COPY --from=composer:2.0 /usr/bin/composer /usr/local/bin/composer

# Instal node/npm
# https://github.com/nodesource/distributions/blob/master/README.md
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

# Install sass
RUN npm i -D sass-loader
RUN npm i -D node-sass

# Install symfony
RUN wget https://get.symfony.com/cli/installer -O - | bash
RUN mv /root/.symfony/bin/symfony /usr/local/bin/symfony
RUN export PATH="$HOME/.symfony/bin:$PATH"
RUN git config --global user.email "example@email.com" \
    && git config --global user.name "Example Username"

