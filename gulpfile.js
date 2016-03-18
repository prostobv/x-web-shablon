var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var minify = require('gulp-minify-css');
var rename = require('gulp-rename');
var rigger = require('gulp-rigger');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');

// connect
gulp.task('connect', function() {
  connect.server({
	root: './public',
	livereload: true
  });
});

gulp.task('build', function(callback) {
	runSequence('clean',
			  ['css', 'copy_other_js', 'copy_other_css', 'compress_js'],//, 'css'], - и другие задачи
			  'html',
			  callback);
});

// clean_html
gulp.task('clean', function(){
	return gulp.src(['./public/*.html', './public/assets/css', './public/assets/js'], {read: false})
		.pipe(clean());
});
 
//html
gulp.task('html', function(){
	return gulp.src('./src/html/*.html')
	.pipe(rigger())
	.pipe(gulp.dest('./public/'))
	.pipe(connect.reload());
});

//css
gulp.task('css', function(){
	gulp.src(['./bower_components/foundation/scss/foundation.scss', './bower_components/foundation/scss/normalize.scss', './src/scss/*.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(gulp.dest('./public/assets/css/'))
		.pipe(minify({compatibility: 'ie8'}))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest('./public/assets/css/'))
		.pipe(connect.reload());
});

// copy other CSS
gulp.task('copy_other_css', function() {
	return gulp.src(['./bower_components/magnific-popup/dist/magnific-popup.css'])//, './src/js/lib/jquery.jgrowl.min.js'])
		.pipe(gulp.dest('./public/assets/css/'));
});


// copy other JS
gulp.task('copy_other_js', function() {
	return gulp.src(['./src/js/html5shiv.js', './bower_components/jquery/dist/jquery.min.js', './bower_components/foundation/js/foundation.min.js', './bower_components/magnific-popup/dist/jquery.magnific-popup.min.js'])//, './src/js/lib/jquery.jgrowl.min.js'])
		.pipe(gulp.dest('./public/assets/js/'));
});

// compress JS
gulp.task('compress_js', function() {
	return gulp.src('./src/js/main.js')
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest('./public/assets/js/'))
		.pipe(connect.reload());
});

// watch
gulp.task('watch', function(){
	gulp.watch('./src/js/*.js', ['compress_js']);
	gulp.watch('./src/scss/**/*.scss', ['css']);
	gulp.watch('./src/html/*.html', ['html']);
	gulp.watch('./src/html/templates/*.html', ['html']);
});

gulp.task('default', ['connect', 'build', 'watch']);
