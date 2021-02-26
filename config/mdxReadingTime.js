// @ts-check

const u = require("unist-builder")
const visit = require("unist-util-visit")
const readingTime = require("reading-time")

const blockTypes = ["paragraph", "heading", "listItem", "blockquote"]

// known issues:
// - lone punctuation (" - ") counts as words
// - any additional text from JSX or rehype plugins doesn't count against reading time

module.exports = () =>
  /**
   * @param {import("unist").Parent} tree
   * @param {import("vfile").VFile} _file
   */
  (tree, _file) => {
    /** @type unknown[] */
    const textContent = []
    visit(tree, ["text", "inlineCode", "code"], (node, index, parent) => {
      const isCode = node.type === "code"
      if (
        isCode ||
        (parent && index === 0 && blockTypes.includes(parent.type))
      ) {
        // make sure block elements get their words separated from neighboring nodes
        textContent.push(" ")
      }
      textContent.push(node.value)
      if (
        isCode ||
        (parent &&
          index === parent.children.length - 1 &&
          blockTypes.includes(parent.type))
      ) {
        textContent.push(" ")
      }
    })
    const time = readingTime(textContent.join(""))
    const exportNode = u(
      "export",
      `export const readingTime = ${JSON.stringify(time)}`
    )
    tree.children.unshift(exportNode)
  }
