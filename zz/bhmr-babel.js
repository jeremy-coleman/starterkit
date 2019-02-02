var spawn = require('child_process').spawn
var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var watchify = require('watchify')
var babelify = require('babelify')
var _ = require('lodash')
var ts = require('typescript')
var ts = require('typescript')
var electron = require('electron')
//const livereactload = require('livereactload');
var hmr = require('browserify-hmr')

var gulp = require('gulp')
//process.env.BABEL_ENV="production"

function compile(fileNames, options) {
    let program = ts.createProgram(fileNames, options);
    program.emit();
}

compile(['src/desktop/main.ts'], {
    noEmitOnError: true, 
    noImplicitAny: true,
    target: ts.ScriptTarget.ESNext, 
    module: ts.ModuleKind.CommonJS,
    outDir: 'dist/desktop'
});


async function appStatic() {
  return gulp.src(['src/app/**/*.{html,ico,svg}'])
  .pipe(gulp.dest('dist/app'))
}
appStatic()


const outfile = path.join('dist', 'app', 'app.js')

const b = watchify(browserify({
  entries: ['src/app/app.tsx'],
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  //standalone: 'coglite',
  cache: {},
  packageCache: {},
  debug: false,
  //plugin: [hmr],
  sourceMaps: false
  //plugin: [tsify, watchify, tinyify]
}))

b.plugin(hmr, {mode: 'fs'})

b.transform(babelify.configure({
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        presets: [['@babel/env', {modules: false}],'@babel/typescript','@babel/react'],
        plugins: ['react-hot-loader/babel', '@babel/plugin-transform-modules-commonjs'],
        sourceMaps: false
  })),

b.transform(require('browserify-postcss'), {
  plugin: [
    'postcss-import',
    'postcss-advanced-variables',
    ['postcss-custom-url', [
      ['inline', { maxSize: 10 }],
      ['copy', {
        assetOutFolder: __dirname + '/dist/app/assets',
        baseUrl: 'assets',
        name: '[name].[hash]',
      }],
    ]],
  ],
  basedir: __dirname + '/src/app',
  inject: true,
})



//b.plugin(livereactload, {host: 'localhost',port: 1337})

b.on('error', console.log)
b.on('syntax', console.log)


function launch() {
  console.log('launching electron')
  const child = spawn(electron, ['dist/desktop/main.js'], {detached: false, stdio: 'inherit'})
  child.on('close', () => {
    console.log('electron is done')
    process.exit(0)
  })
}

launch = _.once(launch)


b.on('update', bundle)

function bundle() {
  b.bundle()
    .on('error',console.error)
    .pipe(fs.createWriteStream(outfile))
    .on('close',launch)
  console.log(`wrote ${outfile}`)
}


bundle()

