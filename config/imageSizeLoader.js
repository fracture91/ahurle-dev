// Copied from https://github.com/boopathi/image-size-loader/blob/bf1f3bc31c1a9ef579a957a77514ef665681848c/index.js
/*
  Copyright 2015 Patrick Collins, Boopathi Rajaa

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// modifications: TS JSDoc, linting, consume output of previous loader, use esmodule syntax
// @ts-check

const loaderUtils = require("loader-utils")
const sizeOf = require("image-size").default
const fs = require("fs")

/**
 * @typedef {import("image-size").ISizeCalculationResult & {
 *  src: string
 *  bytes: number
 * }} Image
 */

/**
 * @param {Image} image
 * @param {boolean} prependPublic
 */
const imageToString = (image, prependPublic) =>
  `export const src = ${
    prependPublic ? "__webpack_public_path__ + " : ""
  }${JSON.stringify(image.src)};\n` +
  `export const width = ${JSON.stringify(image.width)};\n` +
  `export const height = ${JSON.stringify(image.height)};\n` +
  `export const bytes = ${JSON.stringify(image.bytes)};\n` +
  `export const type = ${JSON.stringify(image.type)};\n`
// For requires from CSS when used with webpack css-loader,
// outputting an Object doesn't make sense,
// So overriding the toString method to output just the URL
// "module.exports.toString = function() {\n" +
// "  return module.exports.src;\n" +
// "};\n"

// when esModule: true, the output of url-loader looks like:
//   export default "/some/url/here/image-hash.jpg";
const exportStatement = "export default"
const urlRegex = new RegExp(`${exportStatement} "([^"]+)"`)

/** @type {import("webpack").loader.Loader} */
// eslint-disable-next-line func-names
module.exports = function (source) {
  if (this.cacheable) this.cacheable(true)
  this.addDependency(this.resourcePath)

  const options = loaderUtils.getOptions(this) || {}
  const contentIsJs =
    source.slice(0, exportStatement.length).toString() === exportStatement
  /** @type {string} */
  let url

  if (contentIsJs) {
    const str = source.toString()
    url = str.match(urlRegex)?.[1]
    if (!url)
      throw new Error(
        `Could not parse image URL from '${str.slice(0, 100)}...'`
      )
  } else {
    let filename = "[name].[ext]"

    if (typeof options.name === "string") {
      filename = options.name
    }

    url = loaderUtils.interpolateName(this, filename, {
      context: options.context || this.rootContext || this.context,
      source,
      regExp: options.regExp,
    })
  }

  /** @type {Image} */
  const image = {
    ...sizeOf(this.resourcePath),
    src: url,
    bytes: fs.statSync(this.resourcePath).size,
  }

  if (!contentIsJs && (options.emitFile || this.emitFile)) {
    this.emitFile(url, source)
  }

  return (
    (contentIsJs ? `${source.toString()}\n` : "") +
    imageToString(image, !contentIsJs)
  )
}

module.exports.raw = true
