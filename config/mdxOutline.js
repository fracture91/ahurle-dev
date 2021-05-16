// @ts-check

const u = require("unist-builder")
const visit = require("unist-util-visit")
// @ts-ignore: missing types
const headingRank = require("hast-util-heading-rank")
// @ts-ignore: missing types
const toString = require("hast-util-to-string")
// @ts-ignore: missing types
const toSource = require("unist-util-source")

/** @typedef {import("unist").Node} Node */
/** @typedef {import("unist").Parent} Parent */

/**
 * MDX plugin for generating a document outline based on headings.
 * Exported `outline` const is a custom unist tree where each non-root node
 * has `id` and `text` props matching headings.
 * This tree can then be used e.g. in JSX to create a Table of Contents.
 * Recommend chaining after rehype-slug, rehype-autolink-headings, and rehypeDowngradeH1.
 * Raises an exception if heading levels are skipped.
 */
module.exports =
  () =>
  /**
   * @param {Parent} tree
   * @param {import("vfile").VFile} file
   */
  (tree, file) => {
    /** @param {Node} node */
    const headingDepthError = (node) =>
      file.fail(
        `This heading must be shallower ${toSource(node, file)}`,
        node.position
      )

    /** @type {Parent} */
    const outline = u("root", [])
    const parentStack = [outline]

    visit(
      tree,
      "element",

      /** @param {import("hast").Element} node */
      (node) => {
        /** @type {number | null} */
        const rank = headingRank(node)
        if (rank === 1) throw new Error("headings should be downgraded from H1")
        if (rank === null) return visit.CONTINUE

        const lastDepth = parentStack.length - 1
        const depth = rank - 2
        if (depth - lastDepth > 1) {
          headingDepthError(node)
        } else if (depth > lastDepth) {
          const lastParent = parentStack.slice(-1)[0]
          const lastChild = lastParent.children.slice(-1)[0]
          if (!lastChild) {
            // special case for first heading
            headingDepthError(node)
          }
          // @ts-ignore: no way to cast lastChild as Parent
          parentStack.push(lastChild)
        } else if (depth < lastDepth) {
          const difference = lastDepth - depth
          parentStack.splice(-difference, difference) // pop last N
        }

        /** @type {Parent} */
        const heading = u(
          "heading",
          // could also add depth in here, but I don't need it
          { id: node.properties?.id, text: toString(node) },
          []
        )
        parentStack.slice(-1)[0].children.push(heading)
        return visit.CONTINUE
      }
    )

    const exportNode = u(
      "export",
      `export const outline = ${JSON.stringify(outline)}`
    )
    tree.children.unshift(exportNode)
  }
