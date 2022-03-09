# Concrete5 LAMP server (using Docker / WSL2)

Apache2, PHP, MariaDB, phpMyAdmin, Composer, Node, Sass, Gulp, Concrete5

## Requirements

- WSL2 installed and enabled
- Docker Desktop for Windows installed
- Your project files should be located somewhere in WSL2 subsystem, 
for example in: ```\\wsl$\Ubuntu\home\parasek\dev```
which, under Linux, is accessible through ```~/dev``` path

## Installation

1. Open Windows Terminal, create folder for your project in Linux home directory and download files from git repository.

    ```
    cd ~/dev
    mkdir project_name
    cd project_name
    git clone https://github.com/parasek/lamp-docker.git .
    ```

2. Remove ``.git`` folder

   ```
   sudo rm -r .git
   ```

3. Copy ``.env.dist`` file to ``.env``

   ```
   cp .env.dist .env
   ```

4. If you are installing this docker server for the first time, 
follow instructions (skip otherwise) in:

   > 🔗 [First Installation](#first-installation)

5. If you want to run multiple docker servers at the same time, 
follow instructions (skip otherwise) in:

   > 🔗 [Multiple Docker Servers](#multiple-docker-servers)

6. Rename example apache2 .conf file

    ```
    mv docker/web/apache2/sites-available/000-default.conf.example docker/web/apache2/sites-available/000-default.conf
    ```
   
7. Manually copy saved ssl certificates, that you generated earlier (check 🔗 [First Installation](#first-installation) section) to:

   ```
   docker/server/apache2/ssl/ssl_site.crt
   docker/server/apache2/ssl/ssl_site.csr
   docker/server/apache2/ssl/ssl_site.key
   ```

8. Start docker containers.

    ```
    docker-compose up -d
    ```

9. Default urls and login credentials

   > https url: [https://localhost:8100](https://localhost:8100)  
   > phpMyAdmin: [http://localhost:8200](http://localhost:8200)  
   > http url: [http://localhost:8300](http://localhost:8300)

   > Login credentials for phpMyAdmin/MySQL:  
   > Server: mariadb  
   > Username: root  
   > Password: root  
   > Database: default

10. Popular commands

   ```
   // From Linux terminal
   docker-compose up -d // Start server containers
   docker-compose down // Stop and remove server containers
   docker-compose build // Rebuild containers (for example after changing php version)
   docker-compose exec web bash // Enter web container (where you will be able to run webpack/gulp tasks etc.)
   docker exec -ti local-web bash // Alternative way to enter web container (from anywhere)
   ```

   ```
   // Inside web container
   exit // Exit container
    
   composer install // Install packages listed in composer.json
    
   npm install // Install packages listed in package.json
    
   gulp watch // @TODO gulp commands
    
   npm run dev // @TODO webpack commands
   ```

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

   ```
   openssl genrsa -out "/etc/apache2/ssl/ssl_site.key" 2048
   openssl rand -out /root/.rnd -hex 256
   openssl req -new -key "/etc/apache2/ssl/ssl_site.key" -out "/etc/apache2/ssl/ssl_site.csr" -subj "/CN=localhost/O=LocalServer/C=PL"
   openssl x509 -req -days 3650 -extfile <(printf "subjectAltName=DNS:localhost,DNS:*.localhost") -in "/etc/apache2/ssl/ssl_site.csr" -signkey "/etc/apache2/ssl/ssl_site.key" -out "/etc/apache2/ssl/ssl_site.crt"
   chmod 644 /etc/apache2/ssl/ssl_site.key
   exit
   ```

4. Add generated ``ssl_site.crt`` to Trusted Certificates On Windows 10:
   - Press Windows button and run ``cmd``
   - In cmd.exe window type ``mmc`` and press enter to open Microsoft Management Console
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