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

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import csso from 'gulp-csso';
import concat from 'gulp-concat';
import autoprefixer from 'gulp-autoprefixer';

const sass = gulpSass(dartSass);

const srcPath = './public/themes/theme';
const distPath = './public/themes/theme';
const path = {
    src: srcPath,
    dist: distPath,
    scss: {
        src: `${srcPath}/scss`,
        dist: `${distPath}/css`,
    }
};
const scssSourceFile = `${path.scss.src}/main.scss`;

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
        .pipe(plumber())
        .pipe(gulpif(environment !== 'production', sourcemaps.init()))
        .pipe(sass({ precision: 6, includePaths: ['./node_modules'] }))
        .pipe(concat('styles.min.css'))
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


function watch() {
    gulp.watch(`${path.scss.src}/**/*.*`, { usePolling: true }, gulp.parallel('scss'));
}

exports.default = watch;
exports.watch = watch;

exports.build = gulp.parallel(scss);

exports.scss = scss;
