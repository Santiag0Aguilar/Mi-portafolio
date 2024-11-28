import { src, dest, watch, parallel } from 'gulp';
import gulpSass from 'gulp-sass';
import * as nodeSass from 'sass';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'cssnano';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import notify from 'gulp-notify';
import cache from 'gulp-cache';
import webp from 'gulp-webp';

const sass = gulpSass(nodeSass);

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
};

function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/css'));
}

function javascript() {
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('./build/js'));
}

function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3 })))
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada' }));
}

function versionWebp() {
    return src(paths.imagenes)
        .pipe(webp())
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada' }));
}

function watchArchivos() {
    watch(paths.scss, css);
    watch(paths.js, javascript);
    watch(paths.imagenes, imagenes);
    watch(paths.imagenes, versionWebp);
}

export default parallel(css, javascript, imagenes, versionWebp, watchArchivos);
