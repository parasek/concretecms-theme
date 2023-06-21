/* eslint-disable import/no-import-module-exports */
import gulp from 'gulp';
import rev from 'gulp-rev';
import sourcemaps from 'gulp-sourcemaps';

import yargs from 'yargs';
import log from 'fancy-log';
import del from 'del';
import chalk from 'chalk';
import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import touch from 'gulp-touch-fd';
import named from 'vinyl-named';
import emptyDir from 'empty-dir';
import fs from 'fs';
import axios from 'axios';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import csso from 'gulp-csso';
import concat from 'gulp-concat';
import autoprefixer from 'gulp-autoprefixer';
import penthouse from 'penthouse';
import PurgeCss from 'purgecss';
import { minify } from 'csso';

import webpack from 'webpack-stream';
import browserSyncModule from 'browser-sync';

import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import svgsprite from 'gulp-svg-sprite';

import gulpPo2Mo from 'gulp-po2mo';

const sass = gulpSass(dartSass);
const browserSync = browserSyncModule.create();

const srcPath = './resources';
const distPath = './public/application/themes/theme/dist';
const path = {
    src: srcPath,
    dist: distPath,
    scss: {
        src: `${srcPath}/scss`,
        dist: `${distPath}/css`,
    },
    critical_css: {
        dist: `${distPath}/css/critical`,
    },
    purged_css: {
        dist: `${distPath}/css/purged`,
    },
    js: {
        src: `${srcPath}/js`,
        dist: `${distPath}/js`,
    },
    images: {
        src: `${srcPath}/images`,
        dist: `${distPath}/images`,
    },
    svg: {
        src: `${srcPath}/svg`,
        dist: `${distPath}/svg`,
    },
    favicons: {
        src: `${srcPath}/favicons`,
        dist: `${distPath}/favicons`,
    },
    translation: {
        src: `./public/application/languages/site`,
        dist: `./public/application/languages/site`,
    },
};
const scssSourceFile = `${path.scss.src}/main.scss`;
const jsSourceFile = `${path.js.src}/main.js`;

let environment;
if (yargs.argv.prod !== undefined) {
    environment = 'production';
    log(chalk.green('🚀 Environment set to production (asset minification enabled, source maps disabled). 🚀'));
} else {
    environment = 'development';
    log(chalk.yellow('⚡ Environment set to development (asset minification disabled, source maps enabled). ⚡'));
    log(chalk.yellow('⚡ Use --prod argument on live server. ⚡'));
}

function scss() {
    (async () => {
        await del(`${path.scss.dist}/**`);
    })();

    return gulp
        .src(scssSourceFile)
        .pipe(
            plumber({
                errorHandler(error) {
                    log.error(chalk.red(error));
                    this.emit('end');
                },
            })
        )
        .pipe(gulpif(environment !== 'production', sourcemaps.init()))
        .pipe(sass.sync({ precision: 6, includePaths: ['./node_modules'] }))
        .pipe(concat('app.min.css'))
        .pipe(autoprefixer())
        .pipe(gulpif(environment === 'production', csso()))
        .pipe(gulpif(environment !== 'production', sourcemaps.write('.')))
        .pipe(gulpif('**/*.map', gulp.dest(`${path.scss.dist}`)))
        .pipe(gulpif(['**', '!**/*.map'], rev()))
        .pipe(gulpif(['**', '!**/*.map'], gulp.dest(`${path.scss.dist}`)))
        .pipe(touch())
        .pipe(
            rev.manifest(`${path.dist}/manifest.json`, {
                base: path.dist,
                merge: true,
            })
        )
        .pipe(gulp.dest(path.dist))
        .pipe(touch())
        .pipe(browserSync.stream());
}

function js() {
    (async () => {
        await del(`${path.js.dist}/**`);
    })();

    return gulp
        .src(jsSourceFile)
        .pipe(
            plumber({
                errorHandler(error) {
                    log.error(chalk.red(error));
                    this.emit('end');
                },
            })
        )
        .pipe(named())
        .pipe(
            webpack({
                mode: environment,
                module: {
                    rules: [
                        {
                            test: /\.(js)$/,
                            exclude: /(node_modules)/,
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                            },
                        },
                    ],
                },
            })
        )
        .pipe(concat('app.min.js'))
        .pipe(gulpif(environment !== 'production', sourcemaps.init()))
        .pipe(gulpif(environment !== 'production', sourcemaps.write('.')))
        .pipe(gulpif('**/*.map', gulp.dest(`${path.js.dist}`)))
        .pipe(gulpif(['**', '!**/*.map'], rev()))
        .pipe(gulpif(['**', '!**/*.map'], gulp.dest(`${path.js.dist}`)))
        .pipe(touch())
        .pipe(
            rev.manifest(`${path.dist}/manifest.json`, {
                base: `${path.dist}`,
                merge: true,
            })
        )
        .pipe(gulp.dest(`${path.dist}`))
        .pipe(touch())
        .pipe(browserSync.stream());
}

function images() {
    (async () => {
        await del(`${path.images.dist}/**`);
    })();

    return gulp
        .src(`${path.images.src}/**`)
        .pipe(
            imagemin([
                mozjpeg({ quality: 80 }),
                pngquant({
                    speed: 1,
                    strip: true,
                    quality: [0.9, 0.9],
                }),
                imagemin.svgo({
                    plugins: [{ removeViewBox: false }],
                }),
            ])
        )
        .pipe(gulp.dest(`${path.images.dist}`));
}

function svg() {
    (async () => {
        await del(`${path.svg.dist}/**`);
    })();

    const config = {
        mode: {
            symbol: {
                sprite: `icons.svg`,
            },
        },
        shape: {
            id: {
                separator: '--',
                generator: 'icon-%s',
            },
        },
        svg: {
            xmlDeclaration: false,
        },
    };

    return gulp
        .src(`**/*.svg`, { cwd: `${path.svg.src}` })
        .pipe(svgsprite(config))
        .pipe(gulp.dest(`${path.svg.dist}`));
}

function favicons() {
    (async () => {
        await del(`${path.favicons.dist}/**`);
    })();

    const isEmpty = emptyDir.sync(`${path.favicons.src}`, (filepath) => {
        return /(Thumbs\.db|\.DS_Store|\.gitkeep)$/i.test(filepath);
    });
    if (isEmpty) {
        log.warn(chalk.red(`🦞 Folder: "${path.favicons.src}" is empty. Generate favicons on https://realfavicongenerator.net and paste it there. 🦞`));
    }

    return gulp.src([`${path.favicons.src}/**`]).pipe(gulp.dest(`${path.favicons.dist}`));
}

function translation() {
    (async () => {
        await del(`${path.translation.dist}/*.mo`);
    })();

    return gulp
        .src(`${path.translation.dist}/*.po`)
        .pipe(gulpPo2Mo())
        .pipe(gulp.dest(`${path.translation.dist}`));
}

function handleAxiosError(error) {
    log.error(chalk.red(error));
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        log.error(chalk.red(error.response.data));
        log.error(chalk.red(error.response.status));
        log.error(chalk.red(error.response.headers));
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        log.error(chalk.red(error.request));
    } else {
        // Something happened in setting up the request that triggered an Error
        log.error(chalk.red('Error', error.message));
    }
    log.error(chalk.red(error.config));
}

function startNewCriticalCssJob(pages, options) {
    const page = pages.pop(); // NOTE: mutates urls array
    if (!page) {
        return Promise.resolve();
    }
    const manifest = JSON.parse(fs.readFileSync(`${path.dist}/manifest.json`, 'utf-8'));

    const forceIncludeList = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const regularExpression of options.forceInclude) {
        forceIncludeList.push(new RegExp(regularExpression.replaceAll('/', '')));
    }

    return penthouse({
        url: page.url,
        css: `${path.scss.dist}/${manifest['app.min.css']}`,
        forceInclude: forceIncludeList,
        width: options.width,
        height: options.height,
        keepLargerMediaQueries: options.keepLargerMediaQueries,
    }).then((criticalCss) => {
        if (!fs.existsSync(`${path.critical_css.dist}`)) {
            fs.mkdirSync(`${path.critical_css.dist}`);
        }
        // Remove charset string from the beginning, since it will cause errors in purge task
        const modifiedCriticalCss = criticalCss.replace('@charset "UTF-8";', '');
        fs.writeFileSync(`${path.critical_css.dist}/${page.id}-critical.html`, modifiedCriticalCss);
        log(`Generated critical CSS for page: ${page.url} (${page.id})`);
        return startNewCriticalCssJob(pages, options);
    });
}

// Experimental / Work in progress.
// Currently, this task doesn't work with localhost urls.
// You can modify criticalCss() method in public/application/controllers/workspace.php
// to decide which pages should have critical CSS enabled.
// Running "gulp critical --clear" or "gulp scss" task will remove all critical CSS files.
function critical(cb) {
    (async () => {
        await del(`${path.critical_css.dist}/**`);
    })();

    const jsonUrl = yargs.argv.url;
    const { clear } = yargs.argv;

    if (clear !== undefined) {
        log(chalk.green('All critical CSS files has been removed.'));
        cb();
        return;
    }

    if (jsonUrl === undefined || !jsonUrl.length) {
        log.warn(chalk.red(`🦞 Provide URL for JSON that contains a list of pages. 🦞`));
        log.warn(chalk.red(`🦞 Example: gulp critical --url=https://yoursite.com/workspace/critical 🦞`));
        log.warn(chalk.red(`🦞 To remove all critical CSS files: gulp critical --clear 🦞`));
        log.warn(chalk.red(`🦞 Currently, this task doesn't work with localhost urls 🦞`));
        log.warn(chalk.red(`🦞 You can modify criticalCss() method in public/application/controllers/workspace.php 🦞`));
        cb();
        return;
    }

    axios
        .get(jsonUrl)
        .then(async (response) => {
            log(chalk.green('Critical CSS task has started. Please wait...'));
            const { pages, options } = response.data;
            // How many jobs do we want to handle in parallel?
            Promise.all([
                startNewCriticalCssJob(pages, options),
                startNewCriticalCssJob(pages, options),
                startNewCriticalCssJob(pages, options),
                startNewCriticalCssJob(pages, options),
                startNewCriticalCssJob(pages, options),
            ]).then(() => {
                log(chalk.yellow(`Generated files have been saved in: ${path.critical_css.dist}`));
                log(chalk.yellow(`Modify criticalCss() method in ./public/application/controllers/workspace.php to single out pages for critical CSS.`));
                log(chalk.green('Critical CSS task has ended.'));
            });
        })
        .catch((error) => handleAxiosError(error));

    cb();
}

// Experimental / Work in progress.
// Currently, this task doesn't work with localhost urls.
// You can modify purgeCss() method in public/application/controllers/workspace.php
// to decide which pages should have purged CSS.
// Running "gulp purge --clear" or "gulp scss" task will remove all purged CSS files.
// Keep in mind that purging CSS on every page will prevent from caching common CSS,
// since browser will download different file every time.
async function purge(cb) {
    await (async () => {
        await del(`${path.purged_css.dist}/**`);
    })();

    const jsonUrl = yargs.argv.url;
    const { clear } = yargs.argv;

    if (clear !== undefined) {
        log(chalk.green('All purged CSS files has been removed.'));
        cb();
        return;
    }

    if (jsonUrl === undefined || !jsonUrl.length) {
        log.warn(chalk.red(`🦞 Provide URL for JSON that contains a list of pages. 🦞`));
        log.warn(chalk.red(`🦞 Example: gulp purge --url=https://yoursite.com/workspace/purge 🦞`));
        log.warn(chalk.red(`🦞 To remove all purged CSS files: gulp purge --clear 🦞`));
        log.warn(chalk.red(`🦞 Currently, this task doesn't work with localhost urls 🦞`));
        log.warn(chalk.red(`🦞 You can modify purgeCss() method in public/application/controllers/workspace.php 🦞`));
        cb();
        return;
    }

    axios
        .get(jsonUrl)
        .then(async (response) => {
            log(chalk.green('"This Entire City Must Be Purged". Purge CSS task has started.'));
            const { pages } = response.data;

            const manifest = JSON.parse(fs.readFileSync(`${path.dist}/manifest.json`, 'utf-8'));

            if (!fs.existsSync(`${path.purged_css.dist}`)) {
                fs.mkdirSync(`${path.purged_css.dist}`);
            }

            // eslint-disable-next-line no-restricted-syntax
            for await (const page of pages) {
                await axios.get(page.url).then(async (pageResponse) => {
                    fs.writeFileSync(`${path.purged_css.dist}/${page.id}.html`, pageResponse.data);

                    const standardSafeList = [];
                    const deepSafeList = [];
                    const greedySafeList = [];
                    const keyframesSafeList = [];
                    const variablesSafeList = [];
                    // eslint-disable-next-line no-restricted-syntax
                    for (const regularExpression of page.options.safelist.greedy) {
                        standardSafeList.push(new RegExp(regularExpression.replaceAll('/', '')));
                    }
                    // eslint-disable-next-line no-restricted-syntax
                    for (const regularExpression of page.options.safelist.greedy) {
                        deepSafeList.push(new RegExp(regularExpression.replaceAll('/', '')));
                    }
                    // eslint-disable-next-line no-restricted-syntax
                    for (const regularExpression of page.options.safelist.greedy) {
                        greedySafeList.push(new RegExp(regularExpression.replaceAll('/', '')));
                    }
                    // eslint-disable-next-line no-restricted-syntax
                    for (const regularExpression of page.options.safelist.greedy) {
                        keyframesSafeList.push(new RegExp(regularExpression.replaceAll('/', '')));
                    }
                    // eslint-disable-next-line no-restricted-syntax
                    for (const regularExpression of page.options.safelist.greedy) {
                        variablesSafeList.push(new RegExp(regularExpression.replaceAll('/', '')));
                    }

                    const purgeCSSResults = await new PurgeCss().purge({
                        content: [`${path.purged_css.dist}/${page.id}.html`],
                        css: [`${path.scss.dist}/${manifest['app.min.css']}`],
                        safelist: {
                            standard: standardSafeList,
                            deep: deepSafeList,
                            greedy: greedySafeList,
                            keyframes: keyframesSafeList,
                            variables: variablesSafeList,
                        },
                    });
                    const minifiedCss = minify(purgeCSSResults[0].css).css;

                    fs.writeFileSync(`${path.purged_css.dist}/${page.id}-${manifest['app.min.css']}-purged.css`, minifiedCss);
                    fs.rmSync(`${path.purged_css.dist}/${page.id}.html`);

                    log(`Generated purged CSS for page: ${page.url} (${page.id})`);
                });
            }
        })
        .then(() => {
            log(chalk.yellow(`Generated files have been saved in: ${path.purged_css.dist}`));
            log(chalk.yellow(`Modify purgeCss() method in ./public/application/controllers/workspace.php to single out pages for purge.`));
            log(chalk.green('"This Entire City Must Be Purged". Purge CSS task has ended.'));
        })
        .catch((error) => handleAxiosError(error));

    cb();
}

function watch() {
    gulp.watch(`${path.scss.src}/**/*.*`, { usePolling: true }, gulp.parallel('scss'));
    gulp.watch(`${path.js.src}/**/*.*`, { usePolling: true }, gulp.parallel('js'));
    gulp.watch(`${path.images.src}/**/*.*`, { usePolling: true }, gulp.parallel('images'));
    gulp.watch(`${path.svg.src}/**/*.*`, { usePolling: true }, gulp.parallel('svg'));
    gulp.watch(`${path.favicons.src}/**/*.*`, { usePolling: true }, gulp.parallel('favicons'));
    gulp.watch(`${path.translation.src}/*.po`, { usePolling: true }, gulp.parallel('translation'));

    // Experimental/work in progress.
    // Right off the bat, it works with https://localhost:8100 url.
    // If you have changed port, then you should change it here and in:
    // "public/application/themes/theme/elements/footer/browser_sync.php"
    // Command: gulp watch --bs
    if (yargs.argv.bs !== undefined) {
        log(chalk.green('Browser sync is enabled (experimental/work in progress).'));

        browserSync.init({
            proxy: 'https://localhost:8100',
            open: false,
            injectChanges: true,
            https: {
                key: 'docker/web/apache2/ssl/ssl_site.key',
                cert: 'docker/web/apache2/ssl/ssl_site.crt',
            },
        });

        // This is a preliminary list of files that we can watch (besides scss/js files in resources)
        // These are mostly .php templates and additional css/js files.
        gulp.watch(
            [
                // Watch files inside "themes" folder
                `./public/application/themes/**/*.php`,
                // Watch files inside "blocks" folder
                `./public/application/blocks/*/view.php`,
                `./public/application/blocks/*/view.css`,
                `./public/application/blocks/*/view.js`,
                `./public/application/blocks/*/css/*.*`,
                `./public/application/blocks/*/js/*.*`,
                `./public/application/blocks/templates/*.*`,
                // Watch files inside "single_pages" folder
                `./public/application/single_pages/**/*.php`,
                // Watch files inside "packages" folder
                `./public/packages/*/blocks/*/view.php`,
                `./public/packages/*/blocks/*/view.css`,
                `./public/packages/*/blocks/*/view.js`,
                `./public/packages/*/blocks/*/css/*.*`,
                `./public/packages/*/blocks/*/js/*.*`,
                `./public/packages/*/blocks/templates/*.*`,
                `./public/packages/*/single_pages/**/*.php`,
            ],
            { usePolling: true },
            function additionalFilesHasBeenModified(cb) {
                browserSync.reload();
                return cb();
            }
        );
    } else {
        log(chalk.yellow('⚡ Browser sync is disabled. Use --bs argument to enable it. ⚡'));
    }
}

exports.default = watch;
exports.watch = watch;

exports.build = gulp.parallel(scss, js, images, svg, favicons, translation);

exports.scss = scss;
exports.js = js;
exports.images = images;
exports.svg = svg;
exports.favicons = favicons;
exports.translation = translation;

exports.critical = critical;
exports.purge = purge;
