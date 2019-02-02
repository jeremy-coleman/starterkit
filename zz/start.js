var spawn = require('child_process').spawn
var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var watchify = require('watchify')
var tsify = require('tsify')
var babelify = require('babelify')
var _ = require('lodash')
var ts = require('typescript')
var tinyify = require('tinyify')
var jetpack = require('fs-jetpack')
var ts = require('typescript')
var electron = require('electron')
const livereactload = require('livereactload');

//var vinylServe = require('vinyl-serve')

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


function copyAppDir() {jetpack.copy('src', 'dist', {
  overwrite: true,
  matching: ['*.html', "*.ico",]
 });
}

copyAppDir()


const outfile = path.join('dist', 'app', 'app.js')

const b = watchify(browserify({
  entries: 'src/app/app.tsx',
  //standalone: 'coglite',
  cache: {},
  packageCache: {},
  debug: false,
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  //plugin: [tinyify],
  transform: babelify.configure({
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        presets: ['@babel/typescript','@babel/react', '@babel/env'],
        plugins: ['react-hot-loader/babel', '@babel/plugin-transform-modules-commonjs'],
        sourceMaps: false
  }),
  sourceMaps: false
                
  //plugin: [tsify, watchify, tinyify]
}))

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
//b.pipe()
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

