ARG APP_PHP_VERSION

FROM php:${APP_PHP_VERSION}-apache

WORKDIR /var/www/html

# Add "dev" user/group
RUN groupadd -g ${GROUP_ID:-1000} dev || true \
    && useradd -m -u ${USER_ID:-1000} -g ${GROUP_ID:-1000} -s /bin/bash dev || true \
    && chown -R ${USER_ID:-1000}:${GROUP_ID:-1000} /var/www/html

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
RUN install-php-extensions gd pdo_mysql zip bcmath intl xdebug

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

# Ensure Apache has a global ServerName to suppress the startup warning
RUN printf '%s\n' 'ServerName localhost' > /etc/apache2/conf-available/servername.conf \
    && a2enconf servername

# Copy and run entrypoint
COPY docker/workspace/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]
