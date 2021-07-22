## Simple LAMP server (WSL2 on Windows)
For local development only, use it at your own risk.
<br/><br/>You need to have wsl2 enabled, Docker installed and store files somewhere in ``\\wsl$`` subsystem, for example in:
```\\wsl$\Ubuntu\home\yourlinuxaccount```

1. Create a folder for your project and copy files from git repository
```
cd path/to/your/project/folder
git clone git@github.com:parasek/lamp-docker.git .
```

2. Copy ``.env.dist`` file to ``.env``
<br/><br/>If it is your first server instance, you don't need to change anything.
<br/>If you are running multiple docker servers at once, then you have to set unique names/ports, for example:
```
APP_NAME=othername
APP_PORT_SSL=8101
APP_PMA_PORT=8201
APP_PORT=8301
DB_PORT=33071
```

3. Start Docker container
```
cd path/to/your/project/folder
docker-compose up -d
```

4. Enter server container
```
docker-compose exec server bash
```

5. Create ssl certificates for localhost (you can run those commands in Docker server container)
<br/><br/>If you have already generated files in previous project, you can just copy them to ``docker/server/apache2/ssl`` instead generating new ones.
```
openssl genrsa -out "/etc/apache2/ssl/ssl_site.key" 2048
openssl rand -out /root/.rnd -hex 256
openssl req -new -key "/etc/apache2/ssl/ssl_site.key" -out "/etc/apache2/ssl/ssl_site.csr" -subj "/CN=localhost/O=LocalServer/C=PL"
openssl x509 -req -days 365 -extfile <(printf "subjectAltName=DNS:localhost,DNS:*.localhost") -in "/etc/apache2/ssl/ssl_site.csr" -signkey "/etc/apache2/ssl/ssl_site.key" -out "/etc/apache2/ssl/ssl_site.crt"
chmod 644 /etc/apache2/ssl/ssl_site.key
```

6. On Windows, add ``ssl_site.crt`` to Trusted Certificates
<br/><br/>Press Windows button and run ``cmd``
<br/>In cmd.exe window type ``mmc`` and press enter to open Microsoft Management Console
<br/>Select ``File -> Add/Remove Snap-in``
<br/>Select ``Certificates`` in a left window and click ``Add``
<br/>Click ``Finish``
<br/>Click ``OK``
<br/>Expand tree on the left and go to ``Console Root/Certificates - Current User/Trusted Root Certification Authorities/Certificates``
<br/>Right click ``Certificates`` and select ``All Tasks -> Import...``
<br/>``Next``
<br/>Select generated ``ssl_site.crt`` (from ``\\wsl$`` path) 
<br/>``Next``, ``Next``, ``Finish``
<br/>You can close window without saving

7.  Rename .conf file
```
docker/server/apache2/sites-available/000-default.conf.example
```
to
```
docker/server/apache2/sites-available/000-default.conf
```
Edit path in "DocumentRoot" and "Directory" if necessary.
For example, for Symfony you need to set them to 
```
/var/www/html/public/
```
Restart container
```
exit
docker-compose down
docker-compose up -d
```

8. Default urls
<br/><br/>https url: https://localhost:8100
<br/>phpmyadmin: http://localhost:8200
<br/>http url: http://localhost:8300
<br/><br/>Login credentials for phpmyadmin
<br/>Server: mariadb
<br/>Username: root
<br/>Password: root