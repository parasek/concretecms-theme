# Concrete CMS boilerplate theme - Work in progress

Concrete CMS boilerplate theme consisting of Docker server, Concrete CMS skeleton and custom theme.

Stack: WSL2, Concrete CMS, PHP8, MariaDB, Apache2, phpMyAdmin, Composer, NPM, Sass, Gulp

## Requirements

-   WSL2 installed and enabled
-   Docker Desktop for Windows installed
-   Your project files should be located somewhere in WSL2 subsystem, for example in: `\\wsl$\Ubuntu\home\parasek\dev`
    which, under Linux, is accessible by `~/dev` path

## Installation

1. Open Windows Terminal, create and enter project folder in Linux home directory.

    ```
    cd ~/dev
    mkdir project_name
    cd project_name
    ```

2. Download files from GitHub.

    ```
    git clone https://github.com/parasek/c5-theme.git .
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

7. Copy `000-default.conf.example` file to `000-default.conf`.

    ```
    cp docker/web/apache2/sites-available/000-default.conf.example docker/web/apache2/sites-available/000-default.conf
    ```

8. Manually copy saved ssl certificates, that you generated earlier (skip this step if you did
   🔗 [First Installation](#first-installation) during this setup) to:

    ```
    docker/web/apache2/ssl/ssl_site.crt
    docker/web/apache2/ssl/ssl_site.csr
    docker/web/apache2/ssl/ssl_site.key
    ```

9. Set php version and timezone in `.env` file.

    ```
    APP_PHP_VERSION=8.2
    APP_TZ=Europe/Warsaw
    ```

10. Start Docker containers.

    ```
    docker compose up -d
    ```

11. Install Concrete CMS using Composer.

    Enter web container

    ```
    docker compose exec web bash
    ```

    Install Composer dependencies

    ```
    composer install -o
    ```

    Temporarily change name of live.database.php (installation won't start otherwise)

    ```
    mv public/application/config/live.database.php public/application/config/temp.database.php
    ```

    Install Concrete CMS
    Remember to change fields below before you start installation:
    --site - Site name
    --language - Dashboard interface language
    --site-locale - Main/first installed language on site
    --timezone - Timezone, enter the same as APP_TZ in .env file
    --admin-email - Main account email
    --admin-password - Main account password

    ```
    php public/index.php c5:install --allow-as-root -n --db-server=mariadb --db-username=root --db-password=root --db-database=default --starting-point=theme --site="Sitename" --language=en_US --site-locale=en_GB --timezone=Europe/Warsaw --admin-email=example@email.com --admin-password="password"
    ```

    Revert name change of live.database.php (from now Concrete will be using live.database.php)

    ```
    mv public/application/config/temp.database.php public/application/config/live.database.php
    ```

    Remove original database.php file

    ```
    rm public/application/config/database.php
    ```

    Change required permissions (setting 777 is fine for localhost only)

    ```
    chmod -R 777 public/application/config public/application/files public/packages
    ```

12. Install NPM

    ```
    npm i
    ```

13. Generate css, js and other assets using Gulp tasks

    ```
    gulp build --prod
    ```
    
14. This probably good time to initialize git and make first commit if you are using GIT.

    ```
    git init
    ```

15. Default links and login credentials:

    > https url: [https://localhost:8100](https://localhost:8100) \
    > phpMyAdmin: [http://localhost:8200](http://localhost:8200) \
    > http url: [http://localhost:8300](http://localhost:8300) \

    > Login credentials for phpMyAdmin/MySQL: \
    > Server: mariadb \
    > Username: root \
    > Password: root \
    > Database: default \

## How to update Concrete CMS

1. Enter web container and run composer update:

    ```
    docker-compose exec web bash
    ```

    ```
    composer update
    ```

## How to install Concrete CMS version 8

1. Before installing Composer dependencies, replace `composer.json` with `misc/concrete5.8/composer.json`

    ```
    docker compose exec web bash
    ```

    ```
    cp misc/concrete5.8/composer.json composer.json
    ```

2. Remove `composer.lock`

    ```
    rm composer.lock
    ```

3. Proceed with installation as normal (remember to downgrade php version first).

## How to change PHP version

1. Open .env and change php version (for example: 5.6, 7.4, 8.0 etc.).

    ```
    APP_PHP_VERSION=8.2
    ```

2. Rebuild web container

    ```
    docker compose build
    ```

    ```
    docker compose up -d
    ```

## Most used commands

1. In Linux Terminal:

    ```
    docker compose up -d // Start server containers
    docker compose down // Stop and remove server containers
    docker compose build // Rebuild containers (for example after changing php version)
    docker compose exec web bash // Enter web container (where you will be able to run webpack/gulp tasks etc.)
    docker exec -ti local-web bash // Alternative way to enter web container (from anywhere)
    ```

2. Inside web container:

    ```
    exit // Exit container

    php public/index.php c5:config -g set concrete.maintenance_mode true // Enter maintenance mode
    php public/index.php c5:update // Update Concrete CMS

    composer i -o // Install packages listed in composer.json (with optimized flag)

    npm install // Install packages listed in package.json

    gulp watch // @TODO gulp commands

    npm run dev // @TODO webpack commands
    ```

## Install Concrete CMS without Composer

1. Clear public folder.

    ```
    docker compose exec web bash
    rm -R public
    mkdir public
    cd public
    ```

2. Download the latest version from
   https://www.concretecms.org/download
   and unzip it in public directory.
   You can use Linux commands below or do some/all operations under Windows
   in `\\wsl$\Ubuntu\home\parasek\dev\project_name` folder.

    ```
    // Replace "concrete-cms-9.0.2" with current version name
    // Temporarily include hidden files (.htaccess etc.) in mv command using "shopt"
    unzip concrete-cms-9.0.2.zip
    shopt -s dotglob
    mv concrete-cms-9.0.2/* .
    shopt -u dotglob
    rmdir concrete-cms-9.0.2
    rm concrete-cms-9.0.2.zip
    ```

3. Visit https://localhost:8100 in browser and install Concrete CMS.
   MySQL credentials are the same as mentioned earlier for phpMyAdmin.

4. When moving site to live server, you just want to upload whole public folder + export/import database.

5. This way you can set up server for older version of Concrete CMS or applications that don't require Composer.

## <a name="first-installation"></a>First installation

1. Start Docker containers.

    ```
    cd ~/dev/project_name
    docker compose up -d
    ```

2. Enter web container.

    ```
    // From ~/dev/project_name folder (at the same level as docker compose.yml)
    docker compose exec web bash

    // From any folder
    docker exec -ti local-web bash
    ```

3. Inside web container create ssl certificates for localhost domain
   (in Terminal run every command one by one).

    ```
    openssl genrsa -out "/etc/apache2/ssl/ssl_site.key" 2048
    openssl rand -out /root/.rnd -hex 256
    openssl req -new -key "/etc/apache2/ssl/ssl_site.key" -out "/etc/apache2/ssl/ssl_site.csr" -subj "/CN=localhost/O=LocalServer/C=PL"
    openssl x509 -req -days 7300 -extfile <(printf "subjectAltName=DNS:localhost,DNS:*.localhost") -in "/etc/apache2/ssl/ssl_site.csr" -signkey "/etc/apache2/ssl/ssl_site.key" -out "/etc/apache2/ssl/ssl_site.crt"
    chmod 644 /etc/apache2/ssl/ssl_site.key
    exit
    docker compose down
    ```

4. Add generated `ssl_site.crt` to Trusted Certificates on Windows 10:

    - Press Windows button and run `cmd`
    - In cmd.exe window type `mmc` and press enter to open Microsoft Management Console, allow it to make changes
    - Select `File -> Add/Remove Snap-in`
    - Select `Certificates` in a left window and click `Add`
    - Click `Finish`
    - Click `OK`
    - Expand tree on the left and go
      to `Console Root/Certificates - Current User/Trusted Root Certification Authorities/Certificates`
    - Right click `Certificates` and select `All Tasks -> Import...`
    - `Next`
    - Select generated `ssl_site.crt` (from `\\wsl$\Ubuntu\home\parasek\dev\project_name\docker\web\apache2\ssl` path)
    - `Next`, `Next`, `Finish`, `Yes`
    - You can close window without saving<br/><br/>

    ```
    IMPORTANT!
    Copy/save generated files somewhere on your computer.
    You will be using them everytime you create new project.
    - docker/web/apache2/ssl/ssl_site.crt
    - docker/web/apache2/ssl/ssl_site.csr
    - docker/web/apache2/ssl/ssl_site.key
    ```

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
    ```

   Your site will be accessible through:

   > https url: [https://localhost:8101](https://localhost:8101)
   > phpMyAdmin: [http://localhost:8201](http://localhost:8201)
   > http url: [http://localhost:8301](http://localhost:8301)

   ⬅ [Go back to Installation](#multiple-docker-servers-link)
