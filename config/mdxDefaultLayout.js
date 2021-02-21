// Copied from https://github.com/silvenon/silvenon.com/blob/3f1bfaad8ad4794cacd7623bff7627ce5e21ceda/etc/remark-mdx-default-layout.js
// The MIT License (MIT)
// Copyright (c) Matija Marohnić <matija.marohnic@gmail.com> (silvenon.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// modifications: typescript jsdoc, linting, require layout.name, file.path check

// @ts-check

const u = require("unist-builder")
const path = require("path")

/** @typedef {import("unist").Parent} Tree */
/** @typedef {import("vfile").VFile} File */

/**
 * @typedef {{condition: (tree: Tree, file: File) => boolean, name: string, path: string}} Layout
 * @param {Layout[] | Layout} options
 */
const remarkMdxDefaultLayout = (options = []) =>
  /**
   * @param {Tree} tree
   * @param {File} file
   */
  (tree, file) => {
    const layouts = Array.isArray(options) ? options : [options]

    layouts.forEach((layout) => {
      if (
        typeof layout.condition === "function" &&
        !layout.condition(tree, file)
      ) {
        return
      }

      const layoutPath = typeof layout === "string" ? layout : layout.path

      const existingLayout = tree.children.find(
        (node) => node.type === "export" && node.default
      )

      if (typeof existingLayout !== "undefined") {
        return
      }

      if (!file.path) {
        throw new Error(
          "file.path is missing - not passing filepath to mdx() ?"
        )
      }
      const extension = path.extname(layoutPath)
      const importPath = path.join(
        path.relative(path.dirname(file.path), path.dirname(layoutPath)) || ".",
        path.basename(layoutPath, extension)
      )

      const importNode = u(
        "import",
        `import { ${layout.name} } from ${JSON.stringify(importPath)}`
      )
      const exportNode = u("export", {
        default: true,
        value: `export default ${layout.name}`,
      })

      tree.children.unshift(importNode, exportNode)
    })
  }

module.exports = remarkMdxDefaultLayout
