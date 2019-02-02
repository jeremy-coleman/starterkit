var ts = require('typescript')
var fs = require('fs')

async function compile(fileNames, options) {
    let program = ts.createProgram(fileNames, {
          noEmitOnError: true, 
          noImplicitAny: true,
          target: ts.ScriptTarget.ESNext, 
          module: ts.ModuleKind.CommonJS,
          ...options
        });

    program.emit();
}


let getFileSize = (filePath) => {
  var size = fs.statSync(filePath).size;
  var i = Math.floor( Math.log(size) / Math.log(1024) );
  //@ts-ignore
  return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}

var TASKS = {
    compile,
    getFileSize
}

module.exports = TASKS