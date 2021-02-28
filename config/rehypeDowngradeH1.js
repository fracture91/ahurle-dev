// @ts-check

const visit = require("unist-util-visit")
// @ts-ignore: missing types
const shiftHeadings = require("hast-util-shift-heading")

/**
 * Downgrades all headings if H1 is present.
 * I'm assuming an H1 already exists on the page outside of this doc.
 */
module.exports = () =>
  /**
   * @param {import("unist").Parent} tree
   * @param {import("vfile").VFile} _file
   */
  (tree, _file) => {
    let hasH1 = false
    visit(tree, ["element"], (node) => {
      if (node.tagName === "h1") {
        hasH1 = true
        return visit.EXIT
      }
      return visit.CONTINUE
    })
    if (hasH1) {
      shiftHeadings(tree, 1)
    }
  }
