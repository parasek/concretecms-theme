# Legacy PHP 5.6

These are legacy images if you want to set up an older version of Concrete.

1. Change the dockerfile paths in compose.yaml.

    ```
    dockerfile: docker/5.6-legacy/web/Dockerfile
    dockerfile: docker/5.6-legacy/workspace/Dockerfile
    ```

2. Optionally, copy `docker/5.6-legacy/legacy_files` (gulpfile for scss compilation) into root folder.

3. Optionally, delete unused files from the root folder and remove unused entries from the.env file.

4. Optionally, upload any files into the `public` folder and the database through PhpMyAdmin/command line.
