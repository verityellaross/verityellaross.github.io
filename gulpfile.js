const { watch, src, dest } = require("gulp");
const pipe = require('lazypipe');
const map = require('gulp-sourcemaps');
const fetch = require('node-fetch');
const { createWriteStream: writeAt } = require('fs');
const { join } = require('path')
//TODO: [if required] refactor to `tasks`, `transpilers`
const make = {
   sass: require("gulp-sass"),
   nano: require("gulp-cssnano"),
   mustache: require('gulp-mustache'),
}

const sass = {
   in: 'src/index.scss',
   out: 'dist',
}
const template = {
   src: 'src/index.html',
   out: 'dist',
}

const sassOptions = {
   indentedSyntax: false,
   importer: require("node-sass-magic-importer")()
}
const mustacheOptions = require('./package.json').mustache;

Object.assign(
   module.exports, {
   build(done) {
      src(template)
         .pipe(make.mustache())
      src('src/index.scss')
         .pipe(map.init())
         .pipe(
            make.sass.sync(conf.sass.options)
               .on('error', make.sass.logError)
         )
         .pipe(map.write('.'))
         .pipe(dest('dist'))
      done();
   },
   produce() { },
   download() {

      for (const [path, mapping] of Object.entries(mustacheOptions)) {
         for (const [file, url] of Object.entries(mapping)) {
            console.log('-----URL: ', mapping);
            
            fetch(url)
               .then(res =>
                  res.body.pipe(writeAt(join('./assets',path,file))));
         }
      }
   },
   default() { },

   transpile(done) {
      src('src/index.scss')
         .pipe(map.init())
         .pipe(
            make.sass.sync(conf.sass.options)
               .on('error', make.sass.logError)
         )
         .pipe(map.write('.'))
         .pipe(dest('dist'))
      done();
   },
   nanofy(done) {
      src('dest/index.css')
         .pipe(map.init())
         .pipe(make.nano())
         .plugs(map.write('.'))
         .pipe(dest('dist'));
      done();
   },
   produce(done) {
      src('node_modules/@mdi/svg/svg/*')
         .pipe(dest('dist/svg'));
      src('src/index.scss')
         .pipe(make.sass.sync(conf.sass.options)
            .on('error', make.sass.logError)
         )
         .pipe(make.nano())
         .pipe(dest('dist'))
      done();
   },
   default(done) {
      watch("src/**/*.scss", this.transpile);
      done();
   },
});
