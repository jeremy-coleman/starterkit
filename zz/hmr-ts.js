var spawn = require('child_process').spawn
var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var watchify = require('watchify')
var tsify = require('tsify')
var babelify = require('babelify')
var _ = require('lodash')
var ts = require('typescript')
var electron = require('electron')
const livereactload = require('livereactload');
var gulp = require('gulp')

//process.env.BABEL_ENV="production"


var packageJson = require('./package.json')
const PKG_DEP_EXTERNALS = Object.keys(packageJson.dependencies);
const PKG_EXTERNALS = PKG_DEP_EXTERNALS.concat(Object.keys(packageJson.peerDependencies || {}))
const PKG_DEPS_ALL = PKG_EXTERNALS.concat(Object.keys(packageJson.devDependencies || {}))

 var defaultModules = ['assert', 'buffer', 'console', 'constants', 'crypto', 'domain', 'events', 'http', 'https', 'os', 'path', 'punycode', 'querystring', 'stream', 'string_decoder', 'timers', 'tty', 'url', 'util', 'vm', 'zlib']
var electronModules = ['electron'];
var excludeModules = defaultModules.concat(electronModules.concat(PKG_DEP_EXTERNALS));

console.log(excludeModules)

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


function copyAssets() {
  return gulp.src(['src/app/**/*.{html,ico}'])
  .pipe(gulp.dest('dist/app'))
}
gulp.task('copy:assets', copyAssets)
copyAssets()


const outfile = path.join('dist', 'app', 'app.js')

const b = watchify(browserify({
  entries: ['src/app/app.tsx'],
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  cache: {},
  packageCache: {},
  debug: false,
  sourceMaps: false
}))

excludeModules.forEach(function (moduleName) {b.exclude(moduleName)});

b.plugin(tsify)
b.transform(babelify.configure({
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        plugins: [
            ["@babel/plugin-syntax-typescript"],
            ["@babel/plugin-syntax-decorators", {"legacy": true}],
            ["@babel/plugin-syntax-jsx"],
            "react-hot-loader/babel"
        ],
        sourceMaps: false
  })),



b.transform(require('browserify-postcss'), {
  plugin: [
    //'postcss-import',
    'postcss-easy-import',
    'postcss-advanced-variables',
    ['postcss-custom-url', [
      ['inline', { maxSize: 10 }],
      ['copy', {
        assetOutFolder: __dirname + '/dist/app/assets',
        baseUrl: 'assets',
        name: '[name].[hash]',
      }],
    ]
   ],
   ['postcss-preset-env', { browsers: 'last 2 Chrome versions' }],
     'postcss-inline-svg',
     'postcss-svgo',
    ['@fullhuman/postcss-purgecss', 
      {content: ['src/app/**/*.html', 'src/app/**/*.tsx', 'src/app/**/*.ts', 'src/app/**/*.js']}
   ],
   'postcss-discard-duplicates',
   ['postcss-csso', { restructure: false }]
  ],
  basedir: __dirname + '/src/app',
  inject: true,
})


b.plugin(livereactload, {host: 'localhost',port: 1337})
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

//var gulpTypescript = require('gulp-typescript').createProject('tsconfig.json')

function bundle() {
  b.bundle()
    .on('error',console.error)
    .pipe(fs.createWriteStream(outfile))
    .on('close',launch)
  console.log(`wrote ${outfile}`)
}


bundle()

