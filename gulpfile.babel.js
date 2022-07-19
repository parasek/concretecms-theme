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
import request from 'request';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import csso from 'gulp-csso';
import concat from 'gulp-concat';
import autoprefixer from 'gulp-autoprefixer';
import penthouse from 'penthouse';

import webpack from 'webpack-stream';

import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import svgsprite from 'gulp-svg-sprite';

import gulpPo2Mo from 'gulp-po2mo';

const sass = gulpSass(dartSass);

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
    log.warn(chalk.green('🚀 Environment set to production (asset minification enabled, source maps disabled). 🚀'));
} else {
    environment = 'development';
    log.warn(chalk.yellow('⚡ Environment set to development (asset minification disabled, source maps enabled). Use --prod argument on live server. ⚡'));
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
                    console.log(error);
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
        .pipe(touch());
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
                    console.log(error);
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
        .pipe(touch());
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

    const isEmpty = emptyDir.sync(`${path.favicons.src}`, function (filepath) {
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

// Work in progress. Currently, this task doesn't work with localhost urls.
// You can modify criticalCss() method in public/application/controllers/devops.php
// to decide which pages should have critical CSS enabled.
function critical(cb) {
    (async () => {
        await del(`${path.critical_css.dist}`);
    })();

    const jsonUrl = yargs.argv.url;
    const manifest = JSON.parse(fs.readFileSync(`${path.dist}/manifest.json`));

    if (jsonUrl === undefined || !jsonUrl.length) {
        log.warn(chalk.red(`🦞 Provide URL for JSON that contains a list of page ids/urls. 🦞`));
        log.warn(chalk.red(`🦞 Example: gulp critical --url=https://yoursite.com/devops/critical-css 🦞`));
        log.warn(chalk.red(`🦞 You can modify criticalCss() method in public/application/controllers/devops.php 🦞`));
        cb();
        return;
    }

    request(jsonUrl, function (error, response, body) {
        if (response) {
            if (response.statusCode === 200) {
                const { pages } = JSON.parse(body);
                Object.keys(pages).forEach((key) => {
                    const page = pages[key];
                    penthouse({
                        url: page.url,
                        css: `${path.scss.dist}/${manifest['app.min.css']}`,
                        keepLargerMediaQueries: true,
                        width: 400,
                        height: 700,
                    }).then((criticalCss) => {
                        if (!fs.existsSync(`${path.critical_css.dist}`)) {
                            fs.mkdirSync(`${path.critical_css.dist}`);
                        }
                        fs.writeFileSync(`${path.critical_css.dist}/${page.id}-critical.css`, criticalCss);
                        log(`Generated critical CSS for page: ${page.url} (${page.id})`);
                    });
                });
            } else {
                log.warn(chalk.red(`Error code: ${response.statusCode}`));
                log.warn(chalk.red(`Error message: ${error}`));
            }
        } else {
            log.warn(chalk.red(`Error message: Provide proper url.`));
        }
    });

    cb();
}

function watch() {
    gulp.watch(`${path.scss.src}/**/*.*`, { usePolling: true }, gulp.parallel('scss'));
    gulp.watch(`${path.js.src}/**/*.*`, { usePolling: true }, gulp.parallel('js'));
    gulp.watch(`${path.images.src}/**/*.*`, { usePolling: true }, gulp.parallel('images'));
    gulp.watch(`${path.svg.src}/**/*.*`, { usePolling: true }, gulp.parallel('svg'));
    gulp.watch(`${path.favicons.src}/**/*.*`, { usePolling: true }, gulp.parallel('favicons'));
    gulp.watch(`${path.translation.src}/*.po`, { usePolling: true }, gulp.parallel('translation'));
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