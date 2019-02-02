var path = require('path')
var packageJson = require('../package.json');
var fs = require('fs')

let PATHS = {
  server: {
    src: 'src/server/main.ts',
    dest: 'dist/server/'
  },
  electron: {
    src: 'src/desktop/main.ts',
    dest: 'dist/desktop/'
  },
  client: {
    src: 'src/client/main.tsx',
    SRC_PUG_INDEX: 'src/client/index.pug',
    OUT_FILE: path.join('dist', 'client', 'app.js'),
    OUT_DIR: 'dist/client/',
    dest: 'dist/client/',
    SRC_STYLES: [
    './src/**/*.css',
    'src/**/*.scss',
    'src/**/*.sass',
    'src/**/*.styl',
    'src/**/*.less'
    ],
    DEST_STYLES: 'dist/client/styles.min.css'
  },
}

let POSTCSS_HOT_CONFIG =
{
    plugin: [
    'postcss-easy-import',
    'postcss-advanced-variables',
    ['postcss-custom-url', [
      ['inline', { maxSize: 10 }],
      ['copy', {
        assetOutFolder: path.resolve(__dirname, '..', PATHS.client.dest, 'assets'),
        baseUrl: 'assets',
        name: '[name].[hash]',
      }],
    ]
   ],
      
   ['postcss-preset-env', { browsers: 'last 2 Chrome versions' }],
     'postcss-inline-svg',
     'postcss-svgo',
    ['@fullhuman/postcss-purgecss', 
      {content: ['src/**/*.html', 'src/**/*.tsx', 'src/**/*.ts', 'src/**/*.js']}
   ],
   'postcss-discard-duplicates',
   ['postcss-csso', { restructure: false }]
  ],
  basedir: __dirname + '../src/client',
  inject: true
}


const PKG_DEPENDENCIES = Object.keys(packageJson.dependencies || {});
const PEER_DEPENDENCIES = Object.keys(packageJson.peerDependencies || {});
const DEV_DEPENDENCIES = Object.keys(packageJson.devDependencies || {});


const NODE_INTERNALS = ['assert', 'buffer', 'console', 'constants', 'crypto', 'domain', 'events', 'http', 'https', 'os', 'path', 'punycode', 'querystring', 'stream', 'string_decoder', 'timers', 'tty', 'url', 'util', 'vm', 'zlib'];

const ELECTRON_NODE_INTERNALS = NODE_INTERNALS.concat('electron');

const PROD_RUNTIME_DEPS = PKG_DEPENDENCIES.concat(PEER_DEPENDENCIES)
const ALL_DEPS = PROD_RUNTIME_DEPS.concat(DEV_DEPENDENCIES)

var DEPS = {
  PKG_DEPENDENCIES,
  PEER_DEPENDENCIES, 
  DEV_DEPENDENCIES,
  NODE_INTERNALS,
  ELECTRON_NODE_INTERNALS,
  PROD_RUNTIME_DEPS
}


let CONFIG = {
  DEPS,
  POSTCSS_HOT_CONFIG, 
  PATHS
}

module.exports = CONFIG