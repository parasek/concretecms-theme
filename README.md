# Docker-based skeleton for Concrete CMS

Work in progress

A fully featured Concrete CMS project comprising framework skeleton, 
custom theme, local Docker server and other development tools.

Stack and technologies: Concrete CMS, PHP8, MariaDB, Apache2, phpMyAdmin,
Composer, NPM, Sass, Gulp, PHPUnit, Prettier, ESLint

## Requirements

- Linux or Windows with WSL2 installed and enabled
- Docker Desktop for Windows (Windows)
- Your project files should be located somewhere in WSL2 subsystem, for example in: `\\wsl$\Ubuntu\home\parasek\dev`
  which, under Linux, is accessible by `~/dev` path

## Installation

1. Open Windows Terminal, create and enter the project folder somewhere in the Linux home directory.

    ```
    cd ~/dev
    mkdir project_name
    cd project_name
    ```

2. Download files from GitHub.

    ```
    git clone https://github.com/parasek/concretecms-theme.git .
    ```

3. Remove `.git` folder.

    ```
    sudo rm -r .git
    ```

4. Copy `.env.dist` file to `.env`.

    ```
    cp .env.dist .env
    ```

5. <a name="first-installation-link"></a>If you are installing this Docker server for the first time, follow
   instructions (skip otherwise) in:

   > 🔗 [First Installation](#first-installation)

6. <a name="multiple-docker-servers-link"></a>If you want to run multiple Docker servers at the same time, follow
   instructions (skip otherwise) in:

   > 🔗 [Multiple Docker Servers](#multiple-docker-servers)

7. Open `.env` file and change:
   - APP_PHP_VERSION (PHP version)
   - APP_TZ (Timezone)
   - HOST_DEV_CERTS_PATH (Path to your local ssl certificates)
   - Concrete CMS Installation Settings

8. Make the `install.sh` executable and run it.

   ```
   chmod +x install.sh
   ```

   ```
   sudo ./install.sh
   ```

   Use `--purge` flag to install Concrete CMS from fresh again.
   <br>It is usually used when installation failed, or you want to reinstall Concrete quickly.
   <br>Warning: Among recoverable data, this will delete your database and the public/application/files folder.
   ```
   sudo ./install.sh --purge
   ```

   You can skip Concrete CMS installation by using `--no-concrete` flag.
   <br>Use it when you only want to install the Docker server (for older Concrete projects, etc.).

   ```
   sudo ./install.sh --no-concrete
   ```
    
9. MailHog [http://localhost:8025](http://localhost:8025) is enabled at start. \
   It will catch emails send by your website and provide custom client. \
   Remember to disable it in .env file when your site goes live.
   ```
   # MAILHOG SETTINGS
   MAILHOG_ENABLED=0
   ```

10. Default links and login credentials:

    You might need to reopen your browser after starting the server for the first time (to have working SSL certificates).

    > Https url: [https://localhost:8100](https://localhost:8100) \
    PhpMyAdmin: [http://localhost:8200](http://localhost:8200) \
    Mail server: [http://localhost:8025](http://localhost:8025)

    > Login credentials for phpMyAdmin/MySQL: \
    Server: mariadb \
    Username: root \
    Password: root \
    Database: default

## How to update Concrete CMS

1. Enter workspace container and run composer update:

    ```
    docker-compose exec workspace bash
    ```

    ```
    composer update concrete5/core
    ```

## How to change PHP version

1. Open .env and change php version (for example: 5.6, 7.4, 8.2 etc.).

    ```
    APP_PHP_VERSION=8.2
    ```

2. Rebuild web/workspace container

    ```
    docker compose build
    ```

    ```
    docker compose up -d
    ```

## Most used commands

1. In Linux Terminal:
   ```
   // You should be inside your project folder (where docker-compose.yml is)
   docker compose up -d // Start containers
   docker compose down // Stop and remove containers
   docker compose build // Rebuild containers (for example after changing php version)
   docker compose exec workspace bash // Enter workspace container (where you will be able to run build tasks etc.)
   
   // Anywhere on your computer
   docker exec -ti local-workspace bash // Alternative way to enter workspace container
   ```

2. Inside workspace container:

   ```
   // Custom commands that starts with "npm run" or "composer" are just "aliases".
   // You can find "real" commands inside "package.json" and "composer.json" files.
   
   exit // Exit container.
   
   // These are interchangeable ways to access Concrete binary.
   // Those will display a list of all available commands.
   php public/index.php
   ./vendor/bin/concrete5
   ./public/concrete/bin/concrete
   ./public/concrete/bin/concrete5
   php public/concrete/bin/concrete
   php public/concrete/bin/concrete5
   
   php public/index.php c5:config -g set concrete.maintenance_mode true // Enable maintenance mode.
   php public/index.php c5:config -g set concrete.maintenance_mode false // Disable maintenance mode.
   php public/index.php c5:ide-symbols // Generate helper files for IDE auto-completion.
   
   composer i -o // Install php packages listed in composer.json (with optimized flag).
   
   npm i // Install packages listed in package.json.
   npm update // Update packages listed in package.json.
   
   ######################
   # GULP tasks
   ######################
   
   // Source files are being stored in "./resources" folder.
   // Distribution file are being mostly stored in "./public/application/themes/theme/dist".
   
   gulp // Watch for changes in specified folders and perform related tasks.
   gulp watch // Same as above.
   gulp build // Conduct basic build tasks (scss, js, images, svg, favicons, translation).
   gulp build --prod // Same as above for live site (so with minification, without maps etc.).
   
   gulp scss // Build main css file.
   gulp js // Build main js file.
   gulp images // Compress images, minify svg files and copy them to "dist" folder.
   gulp svg // Build sprites from separate svg files, which then are loaded in "svg_sprites.php". 
   gulp favicons // Copy favicons to "dist" folder.
   gulp translation // Generate .mo files from .po files in ./public/application/languages/site.
   
   ########################
   # Js/CSS linters
   ########################
   
   You should probably configure your IDE, to lint your scss/js files on save.
   Though manual commands are always available.
   Those below are only "aliases", check "package.json" to see what they actually do.
   
   npm run eslint // Show potential js problems in "./resources/js" folder.
   npm run eslint:fix // Lint and show potential js problems in "./resources/js" folder.
   npm run stylelint // Show potential scss problems in "./resources/scss" folder.
   npm run stylelint:fix // Lint and show potential scss problems in "./resources/scss" folder.
   npm run prettier // Show list of file to lint using Prettier.
   npm run prettier:fix // Lint files in "./resources/js" and "./resources/scss" using Prettier.
   
   ########################
   # PHP-CS-Fixer
   ########################
   
   composer fix // Run PHP-CS-Fixer on all locations specified in .php-cs-fixer.php
   composer fix src // Run PHP-CS-Fixer on specific folder
   composer fix src/Foo/Bar/FooBar.php // Run PHP-CS-Fixer on specific file

   #########################
   # Testing
   #########################
   
   composer test // Run all tests
   composer test -- --filter testGetUserInfo // Run specific test

   #########################
   # Concrete settings
   #########################
   
   // Currently, I am using latest versions of PHP-CS-Fixer and PHPUnit
   // To be able to use fixer/run tests using Concrete configurations, 
   // you have to use those versions in composer.json:
   
   "phpunit/phpunit": "~4.3|^8.0",
   "mockery/mockery": "^0.9.9|^1.2",
   "friendsofphp/php-cs-fixer": "2.19.2" 
   
   // Delete composer.lock and run "composer i"
   // Copy phpunit.xml.dist from
   // https://github.com/concretecms/composer/tree/master
   
   php public/index.php c5:phpcs fix src // Run PHP-CS-Fixer using Concrete CMS settings
   composer test // Run tests using Concrete CMS version of PHPUnit
   ```

## <a name="first-installation"></a>First installation

1. Install [mkcert](https://github.com/FiloSottile/mkcert).
   <br>Open PowerShell as Administrator:

    ```
    winget install mkcert
    ```

2. Reopen PowerShell as Administrator. 
   <br>Install local CA and add it to the system trust store:

    ```
    mkcert -install
    ```
   
   Confirm installation.

3. In PowerShell, generate certificates for your local server:

    ```
    mkcert -key-file "localhost.key" -cert-file "localhost.crt" localhost 127.0.0.1 ::1
    ```
   
   This certificate lasts 2 years, so after that you will have to repeat this and the next step.

4. Move `localhost.key` and `localhost.crt` files to WSL2/Linux home folder `~/dev-certs` (or path you have set in .env file for HOST_DEV_CERTS_PATH).

⬅ [Go back to Installation](#first-installation-link)

## <a name="multiple-docker-servers"></a>Multiple Docker Servers

1. If you want to run multiple Docker servers at the same time, you have to set unique name/ports in .env file, for
   example:

    ```
    APP_NAME=othername
    APP_PORT_SSL=8101
    APP_PMA_PORT=8201
    APP_PORT=8301
    APP_DB_PORT=3307
    MAILHOG_HTTP_PORT=8026
    MAILHOG_SMTP_PORT=1026
    ```

   Your site will be accessible through:

   > Https url: [https://localhost:8101](https://localhost:8101) \
   PhpMyAdmin: [http://localhost:8201](http://localhost:8201) \
   Http url: [http://localhost:8301](http://localhost:8301) \
   MailHog server: [http://localhost:8026](http://localhost:8026)

   ⬅ [Go back to Installation](#multiple-docker-servers-link)
