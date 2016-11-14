//jslint node: true

import gulp from 'gulp';
var plugins = require('gulp-load-plugins')({
	pattern: '*',
	rename: {
		'vinyl-source-stream': 'source',
		'node-bourbon': 'bourbon'
	}
});

const dirs = {
	src: "app",
	build: "app/build",
	dist: "docs",
	test: "test"
}

const task = plugins.util.env._[0];
const watch = typeof task === "undefined";

gulp.task('styles', () => {

	return gulp.src(`${dirs.src}/scss/**/*.scss`)
		.pipe(plugins.sass({
			outputStyle: !watch ? 'compressed' : 'expanded',
			includePaths: [plugins.bourbon.includePaths],
			errLogToConsole: false
		}).on('error', reportError))
		.pipe(gulp.dest(`${dirs.build}/css/`))
		.pipe(plugins.browserSync.reload({
			stream: true
		}));
})

gulp.task('scripts', () => {
	let b;
	
	let config = {
		entries: `${dirs.src}/js/src/app.js`
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
			.pipe(gulp.dest(`${dirs.build}/js`))
			.pipe(plugins.browserSync.reload({
				stream: true
			}));
	}

	return rebundle();
});

function reportError(...errors) {
	console.log(errors);
	plugins.notify.onError({
		title: "Compile Error",
		message: "<%= error.message %>"
	}).apply(this, errors);
	return this.emit('end');
};

gulp.task('browser-sync', () => {
	return plugins.browserSync.init(null, {
		server: {
			baseDir: dirs.src
		}
	});
});

gulp.task('bs-reload', () => {
	return plugins.browserSync.reload();
});


gulp.task('images', () => {
	return gulp.src(`${dirs.src}/images/*`)
		.pipe(gulp.dest(`${dirs.build}/images/`))
		.pipe(plugins.browserSync.reload({
			stream: true
		}));
});


gulp.task('copy', ['clean'], () => {
	gulp.src(`${dirs.src}/index.html`)
		.pipe(gulp.dest(dirs.dist));
	
	gulp.src(`${dirs.build}/**/*`, {
		base: dirs.src
	}).pipe(gulp.dest(dirs.dist));
});

gulp.task('clean', ['styles', 'scripts', 'images'], () => {
	return gulp.src(dirs.dist, {
		read: false
	}).pipe(plugins.clean());
});

var date = new Date;

gulp.task('git', plugins.shell.task(['git add -A', "git ci -m 'Deployment " + date + "'", "git push origin :gh-pages --force", "git subtree push --prefix dist origin gh-pages"]));

gulp.task('tests', () => {
	return gulp.src(`${dirs.test}/spec/*.js`)
		.pipe(plugins.jasmine({
			verbose: true
		}));
});

gulp.task('default', ['styles', 'scripts','images','browser-sync'], () => {
	gulp.watch(`${dirs.src}/*.html`, ['bs-reload']);
	gulp.watch(`${dirs.src}/scss/**/*.scss`, ['styles']);
	gulp.watch(`${dirs.src}/images/*`, ['images']);
	gulp.watch(`${dirs.test}/spec/**/*.js`, ['tests']);
});

gulp.task('build', ['copy', 'tests']);

gulp.task('deploy', ['build', 'copy'],() =>{
	gulp.start('git');
});
