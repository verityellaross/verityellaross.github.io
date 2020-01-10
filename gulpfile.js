const { watch, src, dest } = require("gulp");
const map = require('gulp-sourcemaps');
const plugs = {
   sass: require("gulp-sass"),
   sassPlugs: require("node-sass-magic-importer"),
   nano: require("gulp-cssnano"),
}

const conf = {
   sass: {
      options: {
         indentedSyntax: false,
         importer: plugs.sassPlugs(),
         data: '$mdi-path:"test";'
      }
   }
}
Object.assign(
   module.exports, {
   transpile(done) {
      src('src/index.scss')
         .pipe(map.init())
         .pipe(
            plugs.sass.sync(conf.sass.options)
               .on('error', plugs.sass.logError)
         )
         .pipe(map.write('.'))
         .pipe(dest('dist'))
      done();
   },
   nanofy(done) {
      src('dest/index.css')
         .pipe(map.init())
         .pipe(plugs.nano())
         .plugs(map.write('.'))
         .pipe(dest('dist'));
      done();
   },
   produce(done) {
      src('node_modules/@mdi/svg/svg/*')
         .pipe(dest('dist/svg'));
      src('src/index.scss')
         .pipe(plugs.sass.sync(conf.sass.options)
            .on('error', plugs.sass.logError)
         )
         .pipe(plugs.nano())
         .pipe(dest('dist'))
      done();
   },
   default(done) {
      watch("src/**/*.scss", this.transpile);
      done();
   },
});
