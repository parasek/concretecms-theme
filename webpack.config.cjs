const Encore = require('@symfony/webpack-encore');
const fs = require('fs-extra');
const nodePath = require('node:path');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).parse();

const { task } = argv;

const webpQuality = 80;

const srcPath = './assets';
const distPath = './public/application/themes/theme/dist';

const path = {
    src: srcPath,
    dist: distPath,
    images: {
        src: `${srcPath}/images`,
        dist: `${distPath}/images`,
    },
    videos: {
        src: `${srcPath}/videos`,
        dist: `${distPath}/videos`,
    },
    fonts: {
        src: `${srcPath}/fonts`,
        dist: `${distPath}/fonts`,
    },
    flags: {
        src: 'node_modules/flag-icons-svg/svg',
        dist: `${distPath}/flags`,
    },
};

const encoreOutputPath = `${path.dist}/build`;
const encorePublicPath = '/application/themes/theme/dist/build';

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    // directory where compiled assets will be stored
    .setOutputPath(encoreOutputPath)
    // public path used by the web server to access the output path
    .setPublicPath(encorePublicPath)
    // only needed for CDN's or subdirectory deploy
    // .setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', `${srcPath}/app.js`)

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    // .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning()

    // configure Babel
    // .configureBabel((config) => {
    //     config.plugins.push('@babel/a-babel-plugin');
    // })

    // enables and configure @babel/preset-env polyfills
    // .configureBabelPresetEnv((config) => {
    //     config.useBuiltIns = 'usage';
    //     config.corejs = '3.23';
    // })

    // enables Sass/SCSS support
    .enableSassLoader()

    // README !!!
    //
    // If you set options.url to false, Encore will ignore url paths inside .css/.scss files in "/.assets" folder.
    // But in addition, it will also not copy those files to build folder.
    //
    // Example 1: PNG -> WEBP conversion and usage of paths in .scss files
    // Paste .png file into "/.assets/images" folder -> it will be automatically converted to .webp
    // In .scss partial, use relative path (like you would navigate from .scss partial to image in "/.assets" folder):
    // background-image: url('../../../images/bottom-l.webp');
    // In that case options.url has to be set to false
    //
    // Example 2: Loading minified version of Font Awesome
    // If options.url is set to false, Encore will not copy webfont files.
    // You have to do it manually in this file (take a look at  code below "Copy Font Awesome webfonts")
    .configureCssLoader((options) => {
        options.url = false;
    })

    // uncomment if you use TypeScript
    // .enableTypeScriptLoader()

    // uncomment if you use React
    // .enableReactPreset()

    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    .enableIntegrityHashes(Encore.isProduction())

    // uncomment if you're having problems with a jQuery plugin
    // .autoProvidejQuery()

    .addExternals({
        jquery: 'jQuery',
        bootstrap: true,
        vue: 'Vue',
        moment: 'moment',
    });

// Manually handle image assets (without asset versioning)
// Processed when "npm run build" or "npm run dev:assets" is being run
if (Encore.isProduction() || task === 'assets') {
    Encore.addPlugin(() => {
        (async () => {
            // Clear folders
            if (fs.existsSync(path.images.dist)) {
                fs.emptydirSync(path.images.dist);
            }
            if (fs.existsSync(path.flags.dist)) {
                fs.emptydirSync(path.flags.dist);
            }
            if (fs.existsSync(path.videos.dist)) {
                fs.emptydirSync(path.videos.dist);
            }

            const { default: imagemin } = await import('imagemin');
            const { default: webp } = await import('imagemin-webp');
            const { default: imageminSvgo } = await import('imagemin-svgo');


            // Convert jpg/png files into webp format
            const imageFiles = await imagemin([`${path.images.src}/*.{jpg,jpeg,png}`], {
                destination: path.images.dist,
                plugins: [webp({ quality: webpQuality })],
            });

            console.log('\n');
            for (const [key, file] of Object.entries(imageFiles)) {
                console.log(
                    `[${nodePath.extname(file.sourcePath).replace('.', '')} -> webp] "${nodePath.basename(file.sourcePath)}" has been converted to webp and copied to "dist" folder`
                );
            }

            // Minify and cleanup svg files
            const svgFiles = await imagemin([`${path.images.src}/*.svg`], {
                destination: path.images.dist,
                plugins: [
                    imageminSvgo({
                        plugins: [
                            {
                                name: 'preset-default',
                                params: {
                                    overrides: {
                                        cleanupIds: {
                                            remove: false // Do not remove or change ids
                                        }
                                    }
                                }
                            }
                        ]
                    }),
                ],
            });
            for (const [key, file] of Object.entries(svgFiles)) {
                console.log(`[svg] "${nodePath.basename(file.sourcePath)}" has been minified and copied to "dist" folder`);
            }

            // Copy rest of files inside "images" folder
            const otherFiles = fs.readdirSync(path.images.src);
            const excludedExtensions = ['jpg', 'jpeg', 'png', 'svg', 'gitkeep'];
            if (!fs.lstatSync(path.images.src).isDirectory()) return; // Safety check

            if (!fs.existsSync(path.images.dist)) {
                fs.mkdirSync(path.images.dist, { recursive: true });
            }
            otherFiles.forEach((file) => {
                const isFile = fs.lstatSync(`${path.images.src}/${file}`).isFile();
                const extension = nodePath.extname(file).replace('.', '');
                if (isFile && extension && !excludedExtensions.includes(extension)) {
                    fs.copyFile(nodePath.join(path.images.src, file), nodePath.join(path.images.dist, file), (error) => {
                        if (error) throw error;
                        console.log(`[${extension}] "${file}" has been copied to "dist" folder`);
                    });
                }
            });

            // Copy svg flags
            fs.copySync(path.flags.src, path.flags.dist);
            console.log(`[flags] Folder "flags" has been copied from "node_modules" to "dist" folder`);

            // Copy videos
            fs.copySync(path.videos.src, path.videos.dist);
            if (fs.existsSync(`${path.videos.dist}/.gitkeep`)) {
                fs.unlinkSync(`${path.videos.dist}/.gitkeep`);
            }
            console.log(`[videos] Folder "videos" has been copied to "dist" folder`);

            // Copy Fonts
            fs.copySync(path.fonts.src, path.fonts.dist);
            console.log(`[fonts] Folder "fonts" has been copied to "dist" folder`);

            // Copy Font Awesome webfonts
            // We are only doing it, because core uses non-minified version
            const faSrcPath = './node_modules/@fortawesome/fontawesome-free/webfonts';
            const faDistPath = `${distPath}/webfonts`;
            if (fs.existsSync(faDistPath)) {
                fs.removeSync(faDistPath);
            }
            if (fs.existsSync(faSrcPath)) {
                fs.copySync(faSrcPath, faDistPath);
                console.log(`Font Awesome folder "webfonts" has been copied to "dist" folder`);
            }

            console.log('\n');
        })();
    });
}

module.exports = Encore.getWebpackConfig();
