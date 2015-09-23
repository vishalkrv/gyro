//Grab Gulp Packages
var gulp = require('gulp')
log = require('gulp-util').log,
	jshint = require('gulp-jshint'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	minifycss = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	nodemon = require('gulp-nodemon'),
	path = require('path');
var src = {
		scss: 'public/styles/main.scss',
		css: 'public/styles/*.css',
		js: ['server/**/*.js', 'public/scripts/*.js'],
		bower: ['bower.json', '.bowerrc'],
		ignoreNodemon:['GulpFile.js', 'bower.json', '.bowerrc', 'LICENSE','README.md','public/**']
	}
	//Run JSHINT Task
gulp.task('lint', function() {
	return gulp.src(src.js).pipe(jshint()).pipe(jshint.reporter('jshint-stylish'));
});
//Compile SASS to CSS and Minify
gulp.task('styles', function() {
	log('Generating CSS Files ' + new Date().toString());
	return sass(src.scss, {
		style: 'expanded'
	}).pipe(autoprefixer({
		browses: ['last 3 versions', 'IE 9', 'IE 10', 'IE 11']
	})).pipe(sourcemaps.init()).pipe(minifycss()).pipe(sourcemaps.write()).pipe(rename({
		suffix: '.min'
	})).pipe(gulp.dest('public/styles/'));
});
//Associate Tasks to run on watch
gulp.task('watch', function() {
	gulp.watch(src.js, ['lint']);
	gulp.watch(src.scss, ['styles']);
})
gulp.task('server', function() {
	nodemon({
		script: 'index.js',
		ignore:	src.ignoreNodemon
	}).on('restart', function() {
		log('Server Restarted at ' + new Date().toString());
	})
})
gulp.task('start', ['server', 'watch']);