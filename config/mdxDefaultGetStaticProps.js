// @ts-check

const u = require("unist-builder")
const path = require("path")

/** @typedef {import("unist").Parent} Tree */
/** @typedef {import("vfile").VFile} File */

/**
 * If the MDX file doesn't have a getStaticProps export already,
 * add in the default `import { name } from path`.
 *
 * @typedef {{condition: (tree: Tree, file: File) => boolean, name: string, path: string}} GSPConfig
 * @param {GSPConfig[] | GSPConfig} options
 */
const mdxDefaultGetStaticProps =
  (options = []) =>
  /**
   * @param {Tree} tree
   * @param {File} file
   */
  (tree, file) => {
    const gspConfigs = Array.isArray(options) ? options : [options]

    gspConfigs.forEach((gspConfig) => {
      if (
        typeof gspConfig.condition === "function" &&
        !gspConfig.condition(tree, file)
      ) {
        return
      }

      const gspPath = typeof gspConfig === "string" ? gspConfig : gspConfig.path

      const existingGsp = tree.children.find(
        (node) =>
          node.type === "export" &&
          // @ts-ignore: node.value is of type `unknown` but no easy way to cast inline with jsdoc
          node.value.toString().includes("export const getStaticProps")
      )

      if (typeof existingGsp !== "undefined") {
        return
      }

      if (!file.path) {
        throw new Error(
          "file.path is missing - not passing filepath to mdx() ?"
        )
      }
      const extension = path.extname(gspPath)
      const importPath = path.join(
        path.relative(path.dirname(file.path), path.dirname(gspPath)) || ".",
        path.basename(gspPath, extension)
      )

      const importNode = u(
        "import",
        `import { ${gspConfig.name} } from ${JSON.stringify(importPath)}`
      )
      const exportNode = u("export", {
        // layoutProps gets compiled-in by MDX, contains all exports
        // MDXContent is a reference to the JSX itself but haven't needed that yet
        value: `export const getStaticProps = (...args) => ${gspConfig.name}(...args, layoutProps)`, // , MDXContent
      })

      tree.children.unshift(importNode)
      tree.children.push(exportNode)
    })
  }

module.exports = mdxDefaultGetStaticProps
