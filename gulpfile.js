var gulp = require("gulp")
var jetpack = require("fs-jetpack")

jetpack.dir("dist/client")

require("./tasks/postcss")
require("./tasks/roll-desktop")
require("./tasks/watchify")
//require("./tasks/launch")

gulp.task("copy:assets", async () => {
  return gulp.src("src/client/index.html").pipe(gulp.dest("dist/client"))
})


gulp.task("start", gulp.parallel(["copy:assets", "postcss", "desktop", "bundle"]))
