// @ts-check
/**
 * Supports three ways to specify the source:
 *
 * ```
 * // using next-images webpack loader
 * import pancake from "public/img/pancake.jpg"
 *
 * src = pancake // "/_next/static/images/pancakes-1234abcd.jpg"
 * src = "img/pancake.jpg" // optional leading slash, below as well
 * src = "public/img/pancake.jpg"
 * ```
 *
 * Converts each case into a file path relative to project root.
 *
 * @param {string} src
 * @returns {string}
 */

module.exports = (src) => {
  let done = false
  const result = src.replace(/^\//, "").replace(/^_next\//, () => {
    done = true
    return ".next/"
  })
  if (done) return result

  return result.replace(/^public\/|^/, "public/")
}
