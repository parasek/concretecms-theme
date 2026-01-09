FROM php:5.6-apache

WORKDIR /var/www/html

# Enable Apache modules
RUN a2enmod rewrite ssl

# Fix for apt-get update not working:
# https://unix.stackexchange.com/questions/743839/apt-get-update-failed-to-fetch-debian-amd64-packages-while-building-dockerfile-f
RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list

# Install system package
# IMPORTANT!!!
# If fix for "apt-get update" stops working,
# just remove "apt-get install" part (those packages are not really needed)
RUN apt-get update

# Install PHP extensions using mlocati installer
# https://github.com/mlocati/docker-php-extension-installer#usage
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions gd pdo_mysql bcmath zip intl opcache

# Install legacy MySQL for old Concrete versions
RUN docker-php-ext-install mysql

# Ensure Apache has a global ServerName to suppress the startup warning
RUN printf '%s\n' 'ServerName localhost' > /etc/apache2/conf-available/servername.conf \
    && a2enconf servername

# Copy and run entrypoint
COPY docker/web/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]

