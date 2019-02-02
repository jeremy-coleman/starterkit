//var jetpack = require('fs-jetpack')

//var muiFiles = jetpack.find('src/es/**/*.js', {files: true})
//jetpack.rename(muiFiles.map(_ => );

//jetpack.rename('src/es/**/*.js', ;

var gulp = require('gulp')

var rename = require('gulp-rename')

// rename via function
let run = () => {
    return gulp.src("./src/es/**/*.js")
  .pipe(rename({extname:".jsx"}))
  .pipe(gulp.dest("TEMP")); 
}
run()