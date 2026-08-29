ARG APP_PHP_VERSION

FROM php:${APP_PHP_VERSION}-apache

WORKDIR /var/www/html

# Enable Apache modules
RUN a2enmod rewrite ssl

# Fall back to Debian Archive when the image's original repositories are no longer available.
RUN apt-get -o Acquire::Check-Valid-Until=false update \
    || (printf '%s\n' 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99archive \
        && sed -ri \
            -e 's!http://deb.debian.org/debian!http://archive.debian.org/debian!g' \
            -e 's!http://security.debian.org/debian-security!http://archive.debian.org/debian-security!g' \
            -e '/-updates /d' \
            /etc/apt/sources.list \
        && apt-get -o Acquire::Check-Valid-Until=false update)

# Install PHP extensions using mlocati installer
# https://github.com/mlocati/docker-php-extension-installer#usage
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions gd pdo_mysql bcmath zip intl opcache xdebug

# Ensure Apache has a global ServerName to suppress the startup warning
RUN printf '%s\n' 'ServerName localhost' > /etc/apache2/conf-available/servername.conf \
    && a2enconf servername

# Copy and run entrypoint
COPY docker/web/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]
