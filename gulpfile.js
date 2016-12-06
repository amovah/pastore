var gulp = require('gulp');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var rm = require('gulp-rimraf');

/**
 * build pastore
 */

gulp.task('main:clean', function() {
  return gulp.src('build', { read: false })
        .pipe(rm());
});

gulp.task('main:copy', function() {
  return gulp.src(['src/config.json', 'src/database'])
      .pipe(gulp.dest('build'));
});

gulp.task('main:babel', ['main:clean'], function() {
  return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('build'));
});

gulp.task('main:lint', function() {
  return gulp.src('src/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('main:prod', ['main:lint', 'main:babel'], function() {
  return gulp.start('main:copy');
});

gulp.task('main:dev', ['main:babel'], function() {
  return gulp.start('main:copy');
});

gulp.task('main:watch', function() {
  gulp.watch('src/**/*.js', ['main:dev']);
});

/**
 * build tests
 */

gulp.task('test:clean', function() {
  return gulp.src('test/build/**/*', { read: false })
      .pipe(rm());
});

gulp.task('test:babel', ['test:clean'], function() {
 return gulp.src('test/src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('test/build'));
});

gulp.task('test:lint', function() {
  return gulp.src('test/src/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test:build', ['test:lint'], function() {
  return gulp.start('test:babel');
});

gulp.task('test:watch', function() {
  gulp.watch('test/src/**/*.js', ['test:babel']);
});

/**
 * run test
 */

gulp.task('test', function() {
  gulp.src('test/build/**/*.js', { read: false })
      .pipe(mocha({ reporter: 'spec' }));
});
