const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');

const paths = {
  scss: './src/styles/**/*.scss',
  cssDest: './src/styles/generated/'
};

// Compile SCSS → CSS
function styles() {
  return src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(dest(paths.cssDest));
}

// Watch for changes
function watchFiles() {
  watch(paths.scss, styles);
}

exports.styles = styles;
exports.watch = watchFiles;
exports.default = series(styles, watchFiles);

