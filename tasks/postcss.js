var gulp = require("gulp")
var path = require("path")


gulp.task("postcss", () => {
  var postcss = require("gulp-postcss")
  return gulp
    .src("src/client/glob.css")
    .pipe(
      postcss([
        require("postcss-easy-import"),
        //"postcss-advanced-variables",

        require("postcss-custom-url")([
          ["inline", { maxSize: 10 }],
          [
            "copy",
            {
              assetOutFolder: path.resolve(__dirname, "..", "dist/client/assets"),
              baseUrl: "assets",
              name: "[name].[hash]"
            }
          ]
        ]),

        require("postcss-inline-svg"),
        require("postcss-svgo"),
        require("@fullhuman/postcss-purgecss")({
          content: ["src/**/*.html", "src/**/*.tsx", "src/**/*.ts", "src/**/*.js"]
        }),
        require("postcss-discard-duplicates"),
        require("postcss-csso")({ restructure: false })
      ])
    )
    .pipe(gulp.dest("dist/client/assets"))
})
