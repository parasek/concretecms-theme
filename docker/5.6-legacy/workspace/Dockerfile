FROM php:5.6-apache

WORKDIR /var/www/html

# Add "dev" user/group
RUN groupadd -g ${GROUP_ID:-1000} dev || true \
    && useradd -m -u ${USER_ID:-1000} -g ${GROUP_ID:-1000} -s /bin/bash dev || true \
    && chown -R ${USER_ID:-1000}:${GROUP_ID:-1000} /var/www/html

# Add "ll" alias
RUN echo 'alias ll="ls -l"' >> /home/dev/.bashrc \
 && chown ${USER_ID:-1000}:${GROUP_ID:-1000} /home/dev/.bashrc

# Fix for apt-get update not working:
# https://unix.stackexchange.com/questions/743839/apt-get-update-failed-to-fetch-debian-amd64-packages-while-building-dockerfile-f
RUN echo "deb [trusted=yes] http://archive.debian.org/debian stretch main" > /etc/apt/sources.list

# Install system package
# IMPORTANT!!!
# If fix for "apt-get update" stops working,
# just remove "apt-get install" part (those packages are not really needed)
RUN apt-get update && apt-get install -y --allow-unauthenticated  \
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
RUN install-php-extensions gd pdo_mysql bcmath zip intl opcache

# Install legacy MySQL for old Concrete versions
RUN docker-php-ext-install mysql

# Install Composer
COPY --from=composer:2.0 /usr/bin/composer /usr/local/bin/composer

# Install Node.js
# https://github.com/nodesource/distributions#installation-instructions
ARG NODE_MAJOR=16

RUN apt-get update
RUN apt-get install -y apt-transport-https ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

RUN apt-get update
RUN apt-get install nodejs -y

# Install Sass
RUN npm i -D sass-loader
RUN npm i -D node-sass

# Install Gulp globally
# You will be able to run "gulp watch" etc. in web container.
RUN npm install -g gulp

# Ensure Apache has a global ServerName to suppress the startup warning
RUN printf '%s\n' 'ServerName localhost' > /etc/apache2/conf-available/servername.conf \
    && a2enconf servername

# Copy and run entrypoint
COPY docker/workspace/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]
