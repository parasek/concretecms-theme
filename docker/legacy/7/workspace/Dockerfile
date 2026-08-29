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

# Fall back to Debian Archive when the image's original repositories are no longer available.
RUN (apt-get -o Acquire::Check-Valid-Until=false update \
    || (printf '%s\n' 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99archive \
        && sed -ri \
            -e 's!http://deb.debian.org/debian!http://archive.debian.org/debian!g' \
            -e 's!http://security.debian.org/debian-security!http://archive.debian.org/debian-security!g' \
            -e '/-updates /d' \
            /etc/apt/sources.list \
        && apt-get -o Acquire::Check-Valid-Until=false update)) \
    && apt-get install -y --allow-unauthenticated \
        git \
        unzip \
        zip \
        sudo \
        wget \
        nano \
        curl \
        ca-certificates \
        gnupg \
        mc

# Install PHP extensions using mlocati installer
# https://github.com/mlocati/docker-php-extension-installer#usage
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions gd pdo_mysql bcmath zip intl opcache xdebug

# Composer 2.2 LTS supports legacy PHP versions, including PHP 7.0 and 7.1.
COPY --from=composer:2.2 /usr/bin/composer /usr/local/bin/composer

# Install Node.js 16, the newest Node.js line shared by all PHP 7 legacy images.
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_16.x nodistro main" > /etc/apt/sources.list.d/nodesource.list
RUN apt-get update
RUN apt-get install -y nodejs

# Ensure Apache has a global ServerName to suppress the startup warning
RUN printf '%s\n' 'ServerName localhost' > /etc/apache2/conf-available/servername.conf \
    && a2enconf servername

# Copy and run entrypoint
COPY docker/workspace/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]
