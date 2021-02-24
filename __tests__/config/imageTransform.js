const path = require("path")

// keep in sync with imageSizeLoader
// This is a good-enough stub for now, but could fall apart if I'm ever... taking screenshots?
module.exports = {
  process(src, filename, _config, _options) {
    const name = `/${path.basename(filename)}`
    const ext = path.extname(filename)
    return (
      "module.exports = {\n" +
      `  default: ${JSON.stringify(name)},\n` +
      `  src: ${JSON.stringify(name)},\n` +
      "  width: 100,\n" +
      "  height: 100,\n" +
      "  bytes: 4096,\n" +
      `  type: ${JSON.stringify(ext || "jpg")},\n` +
      "}\n"
    )
  },
  getCacheKey(_sourceText, sourcePath, _options) {
    return sourcePath
  },
}
