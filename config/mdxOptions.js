const mdxPrism = require("mdx-prism")
const mdxFilePath = require("./mdxFilePath")

module.exports = {
  remarkPlugins: [mdxFilePath],
  rehypePlugins: [mdxPrism],
}
