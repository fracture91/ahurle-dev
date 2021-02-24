// Copied from https://github.com/kpfromer/portfolio/blob/ba194a9a82c176f7e58f912572d6a0ff8e8bad4c/plugins/image-metadata.ts
// MIT License
// Copyright (c) 2019 Kyle Pfromer
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// modifications: TS -> JSDoc, no placeholder, no promisify, linting, no async, understand public-relative paths

// Similiar structure to:
// https://github.com/JS-DevTools/rehype-inline-svg/blob/master/src/inline-svg.ts

// import { generatePlaceholder, ImgPlaceholder } from '@lib/placeholder';
const sizeOf = require("image-size").default
const visit = require("unist-util-visit")
const srcToFsPath = require("../helpers/srcToFsPath")

/**
 * @typedef {import("unified").Processor} Processor
 * @typedef {import("unist").Node} Node
 * @typedef {import("vfile").VFile} VFile
 */

/**
 * @typedef {Node & {
 *   type: 'element'
 *   tagName: 'img'
 *   properties: {
 *     src: string
 *     height?: number
 *     width?: number
 * }}} ImageNode
 *
 * An `<img>` HAST node
 */

/**
 * Determines whether the given HAST node is an `<img>` element.
 *
 * @param {Node} node
 * @returns {boolean}
 */
function isImageNode(node) {
  const img = node
  return (
    img.type === "element" &&
    img.tagName === "img" &&
    img.properties &&
    typeof img.properties.src === "string"
  )
}

/**
 * Filters out non absolute paths from the public folder.
 *
 * @param {ImageNode} node
 * @returns {boolean}
 */
function filterImageNode(node) {
  return node.properties.src.startsWith("/")
}

/**
 * Adds the image's `height` and `width` to it's properties.
 *
 * @param {ImageNode} node
 * @returns {Promise<void>}
 */
function addMetadata(node) {
  const src = srcToFsPath(node.properties.src)

  const dimensions = sizeOf(src)
  // const placeholder = await generatePlaceholder(node.properties.src)

  if (!dimensions)
    throw Error(`Invalid image with src "${node.properties.src}"`)

  /* eslint-disable no-param-reassign */
  node.properties.src = node.properties.src.replace(/^\/public\//, "/")
  node.properties.width = dimensions.width
  node.properties.height = dimensions.height
  // node.properties.placeholder = placeholder
  /* eslint-enable no-param-reassign */
}

/**
 * This is a Rehype plugin that finds image `<img>` elements and adds the height and width to the properties.
 * Read more about Next.js image: https://nextjs.org/docs/api-reference/next/image#layout
 *
 * @this {Processor}
 */
module.exports = function imageMetadata() {
  /**
   * @param {Node} tree
   * @param {VFile} file
   * @returns {Promise<Node>}
   */
  return function transformer(tree, _file) {
    /** @type {ImageNode[]} */
    const imgNodes = []

    visit(tree, "element", (node) => {
      if (isImageNode(node) && filterImageNode(node)) {
        imgNodes.push(node)
      }
    })

    imgNodes.forEach((node) => addMetadata(node))

    return tree
  }
}
