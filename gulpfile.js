const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const rimraf = require('rimraf');
const postcss = require('gulp-postcss');
const useref = require('gulp-useref');
const runSequence = require('gulp-run-sequence');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const fileinclude = require('gulp-file-include');
const watch = require('gulp-watch');

/*BUILD TASKS*/

gulp.task('build:clean', function(cb) {
  rimraf('./dist/**/*', cb)
});

gulp.task('build:test', function(cb) {

  return gulp.src('./src/preview/*.html')
          .pipe(useref())
          .pipe(gulpif('*.css', autoprefixer()))
          .pipe(gulp.dest('./dist/html'));
});

gulp.task('build:move', function() {
  gulp.src('./src/static/i/*.*')
    .pipe(gulp.dest('./dist/static/i/'));
});

gulp.task('build', function() {
  runSequence('build:clean', 'build:test', 'build:move');
});


/*DEV TASKS*/

gulp.task('dev:css', function() {
  return gulp.src('./src/static/css/*.css')
          .pipe(rename('style.css'))
          .pipe(gulp.dest('./src/static/css/'))
          .pipe(browserSync.stream());  
});

gulp.task('dev:html', function() {
  return gulp.src('./src/html/*.html')
          .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
          }))
          .pipe(gulp.dest('./src/preview'))
});

gulp.task('dev:reload', function() {
  browserSync.reload()
});

gulp.task('dev:serve', function() {
  browserSync.init({
    server: {
      baseDir: './',
      directory: true
    },
    startPath: 'src/preview'
  });

  watch([
    './src/static/css/*.css'
  ], function() {
    runSequence('dev:css')
  });

  watch('./src/static/js/**/*.js', function() {
    runSequence('dev:reload');
  });

  watch('./src/html/**/*.html', function() {
    runSequence('dev:html', 'dev:reload');
  });
});

gulp.task('dev', function() {
  runSequence(['dev:html', 'dev:css'], 'dev:serve');
});