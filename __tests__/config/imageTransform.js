const path = require("path")

// keep in sync with imageSizeLoader
// This is a good-enough stub for now, but could fall apart if I'm ever... taking screenshots?
// Sadly, this breaks the default export in tests since it's not quite compatible with ESM,
// and jest's ESM support is experimental so I'm scared to try it.
// I recommend `import { src } from "myImage.jpg"` instead
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
