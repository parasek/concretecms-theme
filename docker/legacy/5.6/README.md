# Legacy PHP 5.6

> [!WARNING]
> PHP 5.6 and its underlying operating-system packages are unsupported. This image is provided on a best-effort basis and may stop building or working at any time. It is not intended for installing an old Concrete CMS version.

These images support empty, non-Concrete PHP 5.6 projects.

1. Set the PHP version in `.env`:

    ```dotenv
    APP_PHP_VERSION=5.6
    ```

2. Create the empty project:

    ```bash
    sudo ./install.sh --empty
    ```

The installer automatically applies `compose.override.yaml`. It creates a minimal `public/index.php`, Composer manifest, and npm manifest. Composer and npm run inside the workspace, which contains Node.js 16. No frontend build runs.

The files in `example_files` are standalone examples. The installer does not copy or use them.
