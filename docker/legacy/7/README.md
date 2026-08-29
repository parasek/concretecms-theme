# Legacy PHP 7

> [!WARNING]
> PHP 7 and its underlying operating-system packages are unsupported. These images are provided on a best-effort basis and may stop building or working at any time. They are not intended for installing old Concrete CMS versions.

These parameterized images support empty, non-Concrete projects using PHP 7.0 through PHP 7.4.

1. Set the required PHP version in `.env`:

    ```dotenv
    APP_PHP_VERSION=7.4
    ```

2. Create the empty project:

    ```bash
    sudo ./install.sh --empty
    ```

The installer automatically applies `compose.override.yaml`. Composer 2.2 LTS and Node.js 16 are installed in the workspace for compatibility with the PHP 7 image family.
