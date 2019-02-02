var cp = require('child_process')
var fs = require('fs')
var browserify = require('browserify')
var watchify = require('watchify')
var babelify = require('babelify')
var _ = require('lodash')
var electron = require('electron')
var hmr = require('browserify-hmr')
var gulp = require('gulp')

var CONFIG = require('./tasks/config')
var TASKS = require('./tasks/tasks')

var jetpack = require('fs-jetpack')

//this auto creates the dist/client folder..works bc gulp 4 is retarded
jetpack.dir('dist/client')

const b = watchify(browserify({
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  cache: {},
  packageCache: {},
  debug: false,
  sourceMaps: false,
  fullPaths: false
}))


b.exclude(CONFIG.DEPS.PROD_RUNTIME_DEPS)
b.add('src/client/main.tsx')
//b.exclude(CONFIG.DEPS.ALL_DEPS)
b.transform(babelify.configure({
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        presets: [
          ["@babel/preset-typescript"],
          ["@babel/preset-react"]
        ],
        plugins: [
            "react-hot-loader/babel",
            ["@babel/plugin-proposal-decorators", {legacy: true}],
            ["@babel/plugin-proposal-class-properties", {loose: true}],
            ['@babel/plugin-transform-modules-commonjs'],
            ["module-resolver", {
              root: ["./src"],
              //"alias": {"@coglite": "./src/@coglite"} //"underscore": "lodash"
            }
            ],
            
        ],
        sourceMaps: false
  }
  
))

b.plugin(hmr)
b.transform(require('browserify-postcss'), CONFIG.POSTCSS_HOT_CONFIG)

b.on('error', console.log)
b.on('syntax', console.log)


function _launch() {
  console.log(TASKS.getFileSize('./dist/client/app.js'))
  console.log('launching electron')
  const child = cp.spawn(electron, ['dist/desktop/main.js'], {detached: false, stdio: 'inherit'})
  child.on('close', () => {
    console.log('electron is done')
    process.exit(0)
  })
}

let launch = _.once(_launch)

b.on('update', bundle)


async function bundle() {
  b.bundle()
    .on('error',console.error)
    .pipe(fs.createWriteStream(CONFIG.PATHS.client.OUT_FILE))
    .on('close',launch)
}

gulp.task('bundle', gulp.parallel(bundle))
//bundle()




//-------------------desktop -----------------------//
var gulpRollup = require('gulp-rollup')
const transpileElectron = require('gulp-typescript').createProject({
        module: "commonjs",
        target: "esnext",
        lib: ["dom", "dom.iterable","es2015","es2016", "es2017", "esnext"],
        module: "esnext",
        isolatedModules: true
});


gulp.task('desktop', async () => {
    return gulp.src('src/desktop/*.{ts,tsx}')
        .pipe(transpileElectron())
        .pipe(gulpRollup({
            input: "src/desktop/main.js",
            output: {format: 'cjs'},
            external: ["electron"],
            plugins:[
                require('rollup-plugin-auto-external')()
            ]
        }))
        .pipe(gulp.dest('dist/desktop'))
})

gulp.task('copy:assets', async () => gulp.src('src/client/index.html').pipe(gulp.dest('dist/client')))

gulp.task('start', gulp.parallel(['copy:assets', 'desktop', 'bundle']))