ARG APP_PHP_VERSION

FROM php:${APP_PHP_VERSION}-apache

WORKDIR /var/www/html

RUN a2enmod rewrite ssl

RUN apt-get update

# Install PHP extensions using mlocati installer
# https://github.com/mlocati/docker-php-extension-installer#usage
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions
RUN install-php-extensions gd pdo_mysql zip bcmath intl xdebug

# Ensure Apache has a global ServerName to suppress the startup warning
RUN printf '%s\n' 'ServerName localhost' > /etc/apache2/conf-available/servername.conf \
     && a2enconf servername

# Copy and run entrypoint
COPY docker/web/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]
