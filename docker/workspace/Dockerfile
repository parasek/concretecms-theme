ARG APP_PHP_VERSION

FROM php:${APP_PHP_VERSION}-apache

WORKDIR /var/www/html

# Add "dev" user/group
RUN groupadd -g ${GROUP_ID:-1000} dev || true \
    && useradd -m -u ${USER_ID:-1000} -g ${GROUP_ID:-1000} -s /bin/bash dev || true \
    && chown -R ${USER_ID:-1000}:${GROUP_ID:-1000} /var/www/html

# Add "ll" alias
RUN echo 'alias ll="ls -l"' >> /home/dev/.bashrc \
 && chown ${USER_ID:-1000}:${GROUP_ID:-1000} /home/dev/.bashrc

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
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions gd pdo_mysql bcmath zip intl opcache xdebug

# Install Composer
# https://getcomposer.org/doc/00-intro.md#docker-image
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer

# Install Node.js
# https://github.com/nodesource/distributions/wiki/Repository-Manual-Installation
# https://nodesource.com/productdcus/distributions
RUN rm -f /etc/apt/keyrings/nodesource.gpg
RUN rm -f /etc/apt/sources.list.d/nodesource.list

RUN apt-get update
RUN apt-get install -y ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_24.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

RUN apt-get update
RUN apt-get install nodejs -y

# Ensure Apache has a global ServerName to suppress the startup warning
RUN printf '%s\n' 'ServerName localhost' > /etc/apache2/conf-available/servername.conf \
    && a2enconf servername

# Copy and run entrypoint
COPY docker/workspace/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]
