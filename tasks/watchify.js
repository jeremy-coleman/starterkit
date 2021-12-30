var cp = require("child_process")
var fs = require("fs")
var browserify = require("browserify")
var watchify = require("watchify")
var babelify = require("babelify")
var hmr = require("browserify-hmr")
var gulp = require("gulp")
var _ = require("lodash")
var electron = require("electron")

const { builtinModules } = require("module")

const b = watchify(
  browserify({
    entries: ["src/client/main.tsx"],
    //exclude: [CONFIG.DEPS.ALL_DEPS],
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    cache: {},
    packageCache: {},
    debug: false,
    sourceMaps: false,
    fullPaths: false,
    plugin: [[hmr, { disableHostCheck: true }]],
    transform: [
      [
        babelify.configure({
          extensions: [".ts", ".tsx", ".js", ".jsx"],
          presets: [["@babel/preset-typescript"], ["@babel/preset-react"]],
          plugins: [
            "react-hot-loader/babel",
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
            ["@babel/plugin-transform-modules-commonjs"],
            [
              "module-resolver",
              {
                root: ["./src"]
              }
            ]
          ],
          sourceMaps: false
        })
      ]
    ]
  })
)

b.on("error", console.log)
b.on("syntax", console.log)


function _launch() {
  console.log('launching electron')
  const child = cp.spawn(electron, ['dist/desktop/main.js'], {detached: false, stdio: 'inherit'})
  child.on('close', () => {
    console.log('electron shutting down')
    process.exit(0)
  })
}

let launch = _.once(_launch)

b.on('update', bundle)


async function bundle() {
  b.bundle()
    .on('error',console.error)
    .pipe(fs.createWriteStream("dist/client/app.js"))
    .on('close',launch)
}

gulp.task('bundle', gulp.parallel(bundle))
