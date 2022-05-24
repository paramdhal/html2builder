let mix = require('laravel-mix');

mix.js('app/js/app.js', 'build/js')
    .sass('app/scss/main.scss','build/css')
    .copy('app/index.html','docs')
    .copyDirectory('app/images','docs/build/images')
    .setPublicPath('docs');

mix.browserSync({
    server: "docs"
});

