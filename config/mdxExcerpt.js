// @ts-check

const u = require("unist-builder")
const visit = require("unist-util-visit")
const truncate = require("lodash/truncate")

/** @typedef {import("lodash").TruncateOptions} TOps */
/** @param {{
 * maxParagraphs?: number,
 * maxLen?: number,
 * separator?: TOps["separator"],
 * omission?: TOps["omission"]
 * }} options */
module.exports =
  ({
    maxParagraphs = 3,
    maxLen = 300,
    separator = /[\p{P}\p{Z}]+/u, // unicode punctuation, separators
    omission = "…",
  } = {}) =>
  /**
   * @param {import("unist").Parent} tree
   * @param {import("vfile").VFile} _file
   */
  (tree, _file) => {
    let excerpt = ""
    let paragraphsRemaining = maxParagraphs
    let done = false

    visit(tree, "paragraph", (paragraphNode, _index, parent) => {
      if (paragraphsRemaining <= 0) return visit.EXIT
      // skip any paragraphs nested in e.g. admonitions, blockquotes, etc.
      if (parent && parent?.type !== "root") return visit.SKIP

      visit(paragraphNode, ["text", "inlineCode"], (textNode) => {
        excerpt += textNode.value
        excerpt = excerpt.replace(/\s{2,}/g, " ")
        done = excerpt.length > maxLen
        if (done) return visit.EXIT
        return visit.CONTINUE
      })

      if (done) return visit.EXIT
      excerpt += " "
      paragraphsRemaining -= 1
      return visit.CONTINUE
    })

    excerpt = truncate(excerpt.trim(), { length: maxLen, separator, omission })

    const exportNode = u(
      "export",
      `export const excerpt = ${JSON.stringify(excerpt)}`
    )
    tree.children.unshift(exportNode)
  }
