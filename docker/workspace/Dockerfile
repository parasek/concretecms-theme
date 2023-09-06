ARG APP_PHP_VERSION

FROM php:${APP_PHP_VERSION}-apache

WORKDIR /var/www/html

# Add "ll" alias
RUN echo 'alias ll="ls -l"' >> ~/.bashrc

# Install basic packages
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    sudo \
    wget \
    nano \
    curl \
    mc

# Install PHP extensions using mlocati installer
# https://github.com/mlocati/docker-php-extension-installer#usage
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions
RUN install-php-extensions gd pdo_mysql zip bcmath intl

# Install Composer
# https://getcomposer.org/doc/00-intro.md#docker-image
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer

# Install Node.js
# https://github.com/nodesource/distributions#installation-instructions
ARG NODE_MAJOR=20

RUN apt-get update
RUN apt-get install -y ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

RUN apt-get update
RUN apt-get install nodejs -y

# Install Gulp
# https://gulpjs.com/docs/en/getting-started/quick-start/#install-the-gulp-command-line-utility
RUN npm install --global gulp-cli
