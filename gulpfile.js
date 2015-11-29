//jslint node: true

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
	pattern: '*',
	rename: {
		'vinyl-source-stream': 'source',
		'node-bourbon': 'bourbon'
	}
});

var srcDir = "app/";
var buildDir = srcDir+"build/";
var distDir = "dist/";
var testDir = "test/";
var task = plugins.util.env._[0];
var watch = typeof task === "undefined";

gulp.task('styles', function() {

	return gulp.src(srcDir + 'scss/**/*.scss')
		.pipe(plugins.sass({
			outputStyle: !watch ? 'compressed' : 'expanded',
			includePaths: [plugins.bourbon.includePaths],
			errLogToConsole: false
		}).on('error', reportError))
		.pipe(gulp.dest(buildDir+'/css/'))
		.pipe(plugins.browserSync.reload({
			stream: true
		}));
})

gulp.task('scripts', function() {
	var b;
	
	var config = {
		entries: srcDir +'js/src/app.js'
	}
	if(watch){
		config.debug = true;
		config.cache = {};
		config.packageCache = {};
		config.plugin =  [plugins.watchify];
	}
	b = plugins.browserify(config);
	b.transform("babelify", {presets: ["es2015"]});

	if(watch){
		b.on('update', rebundle);
	}
	
	function rebundle(){
		b.bundle().on('error',reportError)
			.pipe(plugins.source('app.js'))
			.pipe(!watch ? plugins.streamify(plugins.uglify()) : plugins.util.noop())
			.pipe(gulp.dest(buildDir + 'js'))
			.pipe(plugins.browserSync.reload({
				stream: true
			}));
	}

	return rebundle();
});

function reportError() {
	var errors,slice = [].slice;
	errors = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	console.log(errors);
	plugins.notify.onError({
		title: "Compile Error",
		message: "<%= error.message %>"
	}).apply(this, errors);
	return this.emit('end');
};

gulp.task('browser-sync', function() {
	return plugins.browserSync.init(null, {
		server: {
			baseDir: srcDir
		}
	});
});

gulp.task('bs-reload', function() {
	return plugins.browserSync.reload();
});


gulp.task('images', function() {
	return gulp.src(srcDir + 'images/*')
		.pipe(gulp.dest(buildDir + 'images/'))
		.pipe(plugins.browserSync.reload({
			stream: true
		}));
});


gulp.task('copy', ['clean'], function() {
	gulp.src(srcDir+'index.html')
		.pipe(gulp.dest(distDir));
	
	gulp.src(buildDir + '**/*', {
		base: srcDir
	}).pipe(gulp.dest(distDir));
});

gulp.task('clean', ['styles', 'scripts', 'images'], function() {
	return gulp.src(distDir, {
		read: false
	}).pipe(plugins.clean());
});

var date = new Date;

gulp.task('git', plugins.shell.task(['git add -A', "git ci -m 'Deployment " + date + "'", "git push origin :gh-pages --force", "git subtree push --prefix dist origin gh-pages"]));

gulp.task('tests', function() {
	return gulp.src(testDir + 'spec/*.js')
		.pipe(plugins.jasmine({
			verbose: true
		}));
});

gulp.task('default', ['styles', 'scripts','images','browser-sync'], function() {
	gulp.watch(srcDir + '*.html', ['bs-reload']);
	gulp.watch(srcDir + 'scss/**/*.scss', ['styles']);
	gulp.watch(srcDir + 'images/*', ['images']);
	gulp.watch(testDir + 'spec/**/*.js', ['tests']);
});

gulp.task('build', ['copy', 'tests']);

gulp.task('deploy', ['build', 'copy'],function(){
	gulp.start('git');
});
