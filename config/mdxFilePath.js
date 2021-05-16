// @ts-check

const u = require("unist-builder")
const path = require("path")

module.exports =
  () =>
  /**
   * @param {import("unist").Parent} tree
   * @param {import("vfile").VFile} file
   */
  (tree, file) => {
    if (!file.path) {
      throw new Error("file.path is missing - not passing filepath to mdx() ?")
    }
    const pathName = path.relative(process.cwd(), file.path)
    const exportNode = u(
      "export",
      `export const path = ${JSON.stringify(pathName)}`
    )
    tree.children.unshift(exportNode)
  }
