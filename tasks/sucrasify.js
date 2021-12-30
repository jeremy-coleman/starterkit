var { Transform, PassThrough } = require("stream")
let sucrase = require("sucrase")
var sucrasify = configure()

module.exports = sucrasify
module.exports.sucrasify = sucrasify
module.exports.configure = configure

var sucraseConfig = (file) => {
  /** @type import('sucrase').Options */
  var options = {
    transforms: ["typescript", "imports", "jsx", "react-hot-loader"],
    //transforms: ["typescript", "imports", "jsx"],
    filePath: file,
    //enableLegacyTypeScriptModuleInterop: true
    enableLegacyBabel5ModuleInterop: true
  }

  return options
}

function configure() {
  return function (filename) {
    if (/\.[tj]sx?$/i.test(filename) === false) {
      return new PassThrough()
    }
    const sucraseOptions = sucraseConfig(filename)
    if (sucraseOptions === null) {
      return PassThrough()
    }
    return new SucraseStream(sucraseOptions)
  }
}

class SucraseStream extends Transform {
  constructor(opts) {
    super()
    this._data = []
    this._opts = opts
  }

  _transform(buf, enc, callback) {
    this._data.push(buf)
    callback()
  }

  _flush(callback) {
    // Merge the buffer pieces after all are available
    const data = Buffer.concat(this._data).toString()

    try {
      let result = sucrase.transform(data, this._opts)
      var code = result !== null ? result.code : data
      this.push(code)
      callback()
    } catch (e) {
      callback(e)
    }
  }
}
