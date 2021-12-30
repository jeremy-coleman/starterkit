var gulp = require("gulp")
var gulpRollup = require("gulp-rollup")
var tsc = require("gulp-typescript").createProject({
  target: "esnext",
  lib: ["dom", "dom.iterable", "esnext"],
  module: "esnext",
  isolatedModules: true
})

gulp.task("desktop", async () => {
  return gulp
    .src("src/desktop/*.{ts,tsx,js,jsx}")
    .pipe(tsc())
    .pipe(
      gulpRollup({
        input: "src/desktop/main.js",
        output: { format: "cjs" },
        external: ["electron"],
        plugins: [require("rollup-plugin-auto-external")()]
      })
    )
    .pipe(gulp.dest("dist/desktop"))
})
