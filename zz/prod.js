var cp = require('child_process')
var fs = require('fs')
var browserify = require('browserify')
var _ = require('lodash')
var electron = require('electron')
var tinyify = require('tinyify')

var CONFIG = require('./tasks/config')
var TASKS = require('./tasks/tasks')


TASKS.compile(['src/desktop/main.ts'], {
    outDir: 'dist/desktop'
});


fs.promises.mkdir('dist/client', {recursive: true})
fs.promises.copyFile('src/client/index.html', 'dist/client/index.html', {recursive: true})


const b = browserify(CONFIG.BROWSERIFY_BASE_CONFIG)
b.exclude(CONFIG.DEPS.ELECTRON_NODE_INTERNALS)
b.plugin('tsify')
b.transform(require('browserify-postcss'), CONFIG.POSTCSS_HOT_CONFIG)


b.plugin(tinyify, {
  env: {
    NODE_ENV: 'production',
    BABEL_ENV: 'production'
  }
}) 


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
