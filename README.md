# Concrete5 LAMP server (using Docker / WSL2)

Apache2, PHP, MariaDB, phpMyAdmin, Composer, Node, Sass, Gulp, Concrete5

## Requirements

- WSL2 installed and enabled
- Docker Desktop for Windows installed
- Your project files should be located somewhere in WSL2 subsystem, 
for example in: ```\\wsl$\Ubuntu\home\parasek\dev```
which, under Linux, is accessible through ```~/dev``` path

## Installation

1. Open Windows Terminal, create and enter folder in Linux home directory.

    ```
    cd ~/dev
    mkdir project_name
    cd project_name
    ```
   
2. Download files from GitHub

    ```
    git clone https://github.com/parasek/lamp-docker.git .
    ```
   
3. Remove ``.git`` folder

   ```
   sudo rm -r .git
   ```

4. Copy ``.env.dist`` file to ``.env``

   ```
   cp .env.dist .env
   ```

5. <a name="first-installation-link"></a>If you are installing this docker server for the first time, 
follow instructions (skip otherwise) in:

   > 🔗 [First Installation](#first-installation)

6. <a name="multiple-docker-servers-link"></a>If you want to run multiple docker servers at the same time, 
follow instructions (skip otherwise) in:

   > 🔗 [Multiple Docker Servers](#multiple-docker-servers)

7. Copy ``000-default.conf.example`` file to ``000-default.conf``

    ```
    cp docker/web/apache2/sites-available/000-default.conf.example docker/web/apache2/sites-available/000-default.conf
    ```
   
8. Manually copy saved ssl certificates, that you generated earlier (skip if you did 🔗 [First Installation](#first-installation) during this setup) to:

   ```
   docker/server/apache2/ssl/ssl_site.crt
   docker/server/apache2/ssl/ssl_site.csr
   docker/server/apache2/ssl/ssl_site.key
   ```

9. Start docker containers.

    ```
    docker-compose up -d
    ```
   
10. Install concrete5 using composer

    Enter web container
    ```
    docker-compose exec web bash
    ```

    Install Composer dependencies
    ```
    composer install -o
    ```

    Temporarily change name of prod.database.php (installation won't start otherwise)
    ```
    mv public/application/config/prod.database.php public/application/config/temp.database.php
    ```

    Install concrete5  
    Instead single command, you can start installation in interactive mode ``./vendor/bin/concrete5 c5:install -i``
    ```
    php public/index.php c5:install --allow-as-root -n --db-server=mariadb --db-username=root --db-password=root --db-database=default --site="Sitename" --language=pl_PL --admin-email=example@email.com --admin-password="admin_password" --site-locale=pl_PL --starting-point=atomik_full --timezone=Europe/Warsaw
    ```

    Revert name change of prod.database.php
    ```
    mv public/application/config/temp.database.php public/application/config/prod.database.php
    ```

    Remove original database.php (concrete5 will use prod.database.php)
    ```
    rm public/application/config/database.php
    ```

    Change required permission
    ```
    chmod -R 755 public/application/config public/application/files public/packages public/updates
    ```

11. Default urls and login credentials

    > https url: [https://localhost:8100](https://localhost:8100)  
    > phpMyAdmin: [http://localhost:8200](http://localhost:8200)  
    > http url: [http://localhost:8300](http://localhost:8300)

    > Login credentials for phpMyAdmin/MySQL:  
    > Server: mariadb  
    > Username: root  
    > Password: root  
    > Database: default

## How to change PHP version?

1. Open .env and change php version (for example: 5.6, 7.4, 8.0 etc.)

    ```
    APP_PHP_VERSION=8.0
    ```
    Rebuild web container

    ```
    docker-compose build
    ```

    ```
    docker-compose up -d
    ```

## Popular commands

1. From Linux terminal  

    ```
    docker-compose up -d // Start server containers
    docker-compose down // Stop and remove server containers
    docker-compose build // Rebuild containers (for example after changing php version)
    docker-compose exec web bash // Enter web container (where you will be able to run webpack/gulp tasks etc.)
    docker exec -ti local-web bash // Alternative way to enter web container (from anywhere)
    ```

2. Inside web container

    ```
    exit // Exit container
   
    php public/index.php c5:config -g set concrete.maintenance_mode true // Enter maintenance mode
    php public/index.php c5:update // Update concrete5
    
    composer i -o // Install packages listed in composer.json (with optimized flag)
    
    npm install // Install packages listed in package.json
    
    gulp watch // @TODO gulp commands
    
    npm run dev // @TODO webpack commands
    ```

## Install concrete5 without composer

1. Download the latest version from 
https://www.concretecms.org/download  
and unzip it in public directory.  
You can use Linux commands below or do some/all operations 
under Windows in ``\\wsl$\Ubuntu\home\parasek\dev\project_name`` folder).

   ```
   docker-compose exec web bash
   rm -R public
   mkdir public
   cd public
   
   // Replace "concrete-cms-9.0.2" with correct name
   // Temporarily include hidden files (.htaccess etc.) in mv command using "shopt"
   unzip concrete-cms-9.0.2.zip
   shopt -s dotglob
   mv concrete-cms-9.0.2/* .
   shopt -u dotglob
   rmdir concrete-cms-9.0.2
   rm concrete-cms-9.0.2.zip
   ```
   
2. Visit https://localhost:8100 in browser and install concrete5.  
MySQL credentials are the same as mentioned earlier for phpMyAdmin.

3. When moving site to server, you just want to upload whole
public folder + export/import database. 

4. This way you can set up server for older version of concrete5 
or applications that don't require composer.

## <a name="first-installation"></a>First installation

1. Start Docker containers

   ```
   cd ~/dev/project_name
   docker-compose up -d
   ```

2. Enter web container

   ```
   // From inside ~/dev/project_name (same level as docker-compose.yml)
   docker-compose exec web bash 
   
   // From any folder
   docker exec -ti local-web bash
   ```

3. Inside web container create ssl certificates for localhost domain
   (in Terminal run every command one by one)

   ```
   openssl genrsa -out "/etc/apache2/ssl/ssl_site.key" 2048
   openssl rand -out /root/.rnd -hex 256
   openssl req -new -key "/etc/apache2/ssl/ssl_site.key" -out "/etc/apache2/ssl/ssl_site.csr" -subj "/CN=localhost/O=LocalServer/C=PL"
   openssl x509 -req -days 7300 -extfile <(printf "subjectAltName=DNS:localhost,DNS:*.localhost") -in "/etc/apache2/ssl/ssl_site.csr" -signkey "/etc/apache2/ssl/ssl_site.key" -out "/etc/apache2/ssl/ssl_site.crt"
   chmod 644 /etc/apache2/ssl/ssl_site.key
   exit
   docker-compose down
   ```

5. Add generated ``ssl_site.crt`` to Trusted Certificates On Windows 10:
   - Press Windows button and run ``cmd``
   - In cmd.exe window type ``mmc`` and press enter to open Microsoft Management Console, allow it to make changes
   - Select ``File -> Add/Remove Snap-in``
   - Select ``Certificates`` in a left window and click ``Add``
   - Click ``Finish``
   - Click ``OK``
   - Expand tree on the left and go
   to ``Console Root/Certificates - Current User/Trusted Root Certification Authorities/Certificates``
   - Right click ``Certificates`` and select ``All Tasks -> Import...``
   - ``Next``
   - Select generated ``ssl_site.crt`` (from ``\\wsl$\Ubuntu\home\parasek\dev\project_name\docker\web\apache2\ssl`` path)
   - ``Next``, ``Next``, ``Finish``, ``Yes``
   - You can close window without saving<br/><br/>


   ```
   IMPORTANT!
   Copy/save generated files somewhere on your computer.  
   You will be using them everytime you create new project.
   - docker/server/apache2/ssl/ssl_site.crt
   - docker/server/apache2/ssl/ssl_site.csr
   - docker/server/apache2/ssl/ssl_site.key
   ```

   ⬅ [Go back to Installation](#first-installation-link)

## <a name="multiple-docker-servers"></a>Multiple Docker Servers

1. If you want to run multiple docker servers at the same time, you have to set unique name/ports in .env file, for example:

    ```
    APP_NAME=othername
    APP_PORT_SSL=8101
    APP_PMA_PORT=8201
    APP_PORT=8301
    APP_DB_PORT=33071
    ```

   Your site will be accessible through:

   > https url: [https://localhost:8101](https://localhost:8101)  
   > phpMyAdmin: [http://localhost:8201](http://localhost:8201)  
   > http url: [http://localhost:8301](http://localhost:8301)  

   ⬅ [Go back to Installation](#multiple-docker-servers-link)