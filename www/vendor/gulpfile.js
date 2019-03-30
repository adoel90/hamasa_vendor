var gulp = require('gulp'),
cssmin = require('gulp-cssmin'),
uglify = require('gulp-uglify'),
pug = require('gulp-pug'),
sass = require('gulp-sass'),
nop = require('gulp-nop'),
del = require('del'),
nodemon = require('gulp-nodemon'),
livereload = require('gulp-livereload'),
notify = require('gulp-notify'),
runSequence = require('run-sequence'),
cssimport = require('gulp-as-css-imports');

var task = ['fonts', 'css', 'styles', 'js', 'watch', 'js_vendor', 'html_alert',
	'html_widget', 'html_modal', 'img'];

var path = {
	dist: 'dist/',
	fonts: 'www/fonts/',
	css: 'www/css/',
	styles: 'www/styles/',
	img: 'www/img/',
	js: 'www/js/',
	view: 'www/view/',
	vendor: 'www/vendor/'
}


gulp.task('del', function(e){
	return del(path.dist);
});

gulp.task('fonts', function() {
	return gulp
	.src(path.fonts + '/**/*')
	.pipe(gulp.dest(path.dist + 'fonts/'))
})

gulp.task('css', function() {
	return gulp
	.src(path.css+'/**/*')
	.pipe(cssmin())
	.pipe(gulp.dest(path.dist+'css/'));
});

gulp.task('styles', function() {
	return gulp
	.src(path.styles + '/**/[^_]*.?(s)css')
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest(path.dist + 'styles/'))
})

gulp.task('js', function(){
	return gulp
	.src(path.js+'/**/*')
	.pipe(nop())
	.pipe(gulp.dest(path.dist+'js/'))
});

gulp.task('js_vendor', function(){
	return gulp
	.src(path.vendor+'*')
	.pipe(nop())
	.pipe(gulp.dest(path.dist+'vendor/'))
})

gulp.task('img', function() {
	return gulp
	.src(path.img+'*')
	.pipe(gulp.dest(path.dist+'img/'));
});

gulp.task('html_widget', function() {
	return gulp
	.src(path.view + 'widget/*')
	.pipe(pug())
	.pipe(nop())
	.pipe(gulp.dest(path.dist + 'view/widget'))
});

gulp.task('html_modal', function(){
	return gulp
	.src(path.view+'modal/*')
	.pipe(pug())
	.pipe(nop())
	.pipe(gulp.dest(path.dist+'view/modal'))
})

gulp.task('html_alert', function(){
	return gulp
	.src(path.view+'alert/*')
	.pipe(pug())
	.pipe(nop())
	.pipe(gulp.dest(path.dist+'view/alert'))
})

gulp.task('watch', function() {
	// Listen Livereload
	livereload.listen();

	gulp.watch(path.styles+'**/*', ['styles']);
	gulp.watch(path.css+'**/*', ['css']);
	gulp.watch(path.js+'**/*', ['js']);
	gulp.watch(path.view+'modal/*', ['html_modal']);
	gulp.watch(path.view+'alert/*', ['html_alert']);
	gulp.watch(path.view+'widget/*', ['html_widget']);
});

gulp.task('devServe', function() {
	// Listen Livereload
	livereload.listen();

	return nodemon({
		script: 'index.js',
		ext: 'pug',
		watch: '*.pug'
	});
});

gulp.task('default', function(e) {
	runSequence('del', task, 'devServe', function() {
		console.log('Application files had been streamed and express server started');
	});
});
