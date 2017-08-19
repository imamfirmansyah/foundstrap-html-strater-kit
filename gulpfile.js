/**
* Gulpfile.
* Project Configuration for gulp tasks.
*/

var pkg                     = require('./package.json');
var project                 = pkg.name;
var slug                    = pkg.slug;
var version                 = pkg.version;

var gulp 					= require('gulp');
var	nunjucksRender 			= require('gulp-nunjucks-render');
var browserSync 			= require('browser-sync').create();
var htmlbeautify            = require('gulp-html-beautify');

var config = {
    output: 'dist',
    templates: 'app/templates',
    pages: 'app/pages',
    image: 'app/img',
    dependencies: './node_modules'
}

// writing up the gulp nunjucks task
gulp.task( 'nunjucks', function() {
    console.log('Rendering nunjucks files..');
    return gulp.src(config.pages + '/**/*.+(html|nunjucks)')
        .pipe(nunjucksRender({
          path: [config.templates],
          watch: true,
        }))
        .pipe(htmlbeautify({
            "indent_size" : 2,
            "max_preserve_newlines" : 0
        }))
        .pipe(gulp.dest(config.output));
});

gulp.task( 'browserSync', function() {
    browserSync.init({
        server: {
            baseDir: config.output
        },
    });
});

gulp.task('watch', function() {
    // trigger Nunjucks render when pages or templates changes
    gulp.watch([
    	config.pages + '/**/*.+(html|js|css)', 
    	config.templates + '/**/*.+(html|js|css)'
    ], ['nunjucks']);
    
    // reload browsersync when `dist` changes
    gulp.watch(config.output + '/*').on('change', browserSync.reload);
});

gulp.task( 'img', function() {
    return gulp.src([
        config.image + '/**/*',
    ])
    .pipe(gulp.dest(config.output + '/img'));
});

gulp.task( 'css', function() {
    return gulp.src([
        config.dependencies + '/bootstrap/dist/css/bootstrap.min.css',
    ])
    .pipe(gulp.dest(config.output + '/css'));
});

gulp.task( 'js', function() {
    return gulp.src([
        config.dependencies + '/jquery/dist/jquery.slim.min.js',
        config.dependencies + '/popper.js/dist/umd/popper.min.js',
        config.dependencies + '/bootstrap/dist/js/bootstrap.min.js'

    ])
    .pipe(gulp.dest(config.output + '/js'));
});

// run browserSync auto-reload together with nunjucks auto-render
gulp.task( 'auto', [
    'css',
    'img',
    'js',
    'nunjucks', 
    'browserSync', 
    'watch' 
    ]
);

//default task to be run with gulp
gulp.task('default', ['nunjucks']);