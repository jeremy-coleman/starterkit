var cp = require('child_process')
var fs = require('fs')
var browserify = require('browserify')
var watchify = require('watchify')
var babelify = require('babelify')
var _ = require('lodash')
var electron = require('electron')
var hmr = require('browserify-hmr')

var CONFIG = require('./tasks/config')
var TASKS = require('./tasks/tasks')


TASKS.compile(['src/desktop/main.ts'], {
    outDir: 'dist/desktop'
});


fs.promises.mkdir('dist/client', {recursive: true})
fs.promises.copyFile('src/client/index.html', 'dist/client/index.html', {recursive: true})


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
//b.transform(babelify.configure(CONFIG.BABEL_HOT_CONFIG))
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


function bundle() {
  b.bundle()
    .on('error',console.error)
    .pipe(fs.createWriteStream(CONFIG.PATHS.client.OUT_FILE))
    .on('close',launch)
}

bundle()



// b.plugin(tinyify, {
//   env: {
//     NODE_ENV: 'production',
//     BABEL_ENV: 'production'
//   }
// }) 
