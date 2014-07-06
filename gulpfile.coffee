#jslint node: true

gulp = require 'gulp'
sass = require 'gulp-sass'
clean = require 'gulp-clean'
browserify = require 'browserify'
browserSync = require 'browser-sync'
bourbon = require('node-bourbon').includePaths
source = require 'vinyl-source-stream'
streamify = require 'gulp-streamify'
gutil = require 'gulp-util'
uglify = require 'gulp-uglify'
shell = require 'gulp-shell'
jasmine = require 'gulp-jasmine'
task = gutil.env._[0]

#Styles
gulp.task 'styles', ->
	gulp.src 'app/scss/**/*.scss'
		.pipe sass
			outputStyle: if task is 'build' then 'compressed' else 'expanded'
			includePaths : [bourbon]
			onError: reportError
		.pipe gulp.dest 'app/build/css/'
		.pipe browserSync.reload stream:true

#Scripts
gulp.task 'scripts', ->
	#Single entry point to browserify
	b = browserify
		basedir: './app/js/src/'
		extensions: '.coffee'
	
	bundleStream = b.add './app.js'
		.bundle
			debug: true
		.on 'error',reportError

	 bundleStream
		.pipe source 'app.js'
		.pipe if task is 'build' then streamify uglify() else gutil.noop()
		.pipe gulp.dest 'app/build/js'
		.pipe browserSync.reload stream:true

reportError = (error) ->
	gutil.log gutil.colors.red(error)
	browserSync.notify error
	gutil.beep()

#Browser sync
gulp.task 'browser-sync', ->
	browserSync.init null,
		server:
			baseDir: './app'


#Reload all Browsers
gulp.task 'bs-reload', -> browserSync.reload()

#Copy to dist directory
gulp.task 'copy',['clean'],->
	gulp.src './app/index.html'
		.pipe gulp.dest 'dist/'
	gulp.src './app/build/**/*', base: './app/'
		.pipe gulp.dest 'dist/'	

#Clean dist directory
gulp.task 'clean',['styles','scripts'],->
	gulp.src 'dist/', read: false
		.pipe clean()

date =new Date

#Deploy task
gulp.task 'git', shell.task ['git add -A',"git ci -m 'Deployment #{date}'",
"git push origin :gh-pages --force", 
"git subtree push --prefix dist origin gh-pages"]

#Tests
gulp.task 'tests', ->
	gulp.src 'test/spec/*.coffee'
		.pipe jasmine()

#Watch files
gulp.task 'watch', ['styles','scripts', 'browser-sync'], ->
	gulp.watch 'app/*.html', ['bs-reload']
	gulp.watch 'app/scss/**/*.scss', ['styles']
	gulp.watch 'app/js/src/**/*.js',['scripts']
	gulp.watch 'app/js/src/**/*.coffee',['scripts','tests']
	gulp.watch 'test/spec/**/*.coffee', ['tests']

gulp.task 'build',['copy','test']

gulp.task 'deploy',['build','copy'],->
	gulp.start 'git'

