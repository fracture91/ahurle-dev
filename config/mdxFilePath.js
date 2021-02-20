// @ts-check

const u = require("unist-builder")
const path = require("path")

module.exports = () =>
  /**
   * @param {{ children: { type: "export"; value: string; }[]; }} tree
   * @param {{ path: string; }} file
   */
  (tree, file) => {
    const pathName = path.relative(process.cwd(), file.path)
    const exportNode = u(
      "export",
      `export const path = ${JSON.stringify(pathName)}`
    )
    tree.children.unshift(exportNode)
  }
