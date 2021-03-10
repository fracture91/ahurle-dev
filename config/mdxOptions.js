// @ts-check

// @ts-ignore: no types for mdx-prism
const mdxPrism = require("mdx-prism")
const rehypeSlug = require("rehype-slug")
const rehypeAutolinkHeadings = require("rehype-autolink-headings")
const rehypeDowngradeH1 = require("./rehypeDowngradeH1")
const mdxImageMetadata = require("./mdxImageMetadata")
const mdxFilePath = require("./mdxFilePath")
const mdxExcerpt = require("./mdxExcerpt")
const mdxReadingTime = require("./mdxReadingTime")
const mdxOutline = require("./mdxOutline")
const mdxDefaultLayout = require("./mdxDefaultLayout")
const mdxDefaultGsp = require("./mdxDefaultGetStaticProps")

/** @type {import("./mdxDefaultLayout").Layout["condition"]} */
const blogCondition = (_tree, file) =>
  (file?.path?.startsWith(`${process.cwd()}/pages/blog`) &&
    file?.path !== `${process.cwd()}/pages/blog/index.mdx`) ||
  false

/** @type {import("./mdxDefaultLayout").Layout} */
const defaultLayoutOptions = {
  name: "MDXBlogLayout",
  condition: blogCondition,
  path: require.resolve("../components/MDXBlogLayout.tsx"),
}

/** @type {import("./mdxDefaultGetStaticProps").GSPConfig} */
const defaultGspOptions = {
  name: "getBlogStaticProps",
  condition: blogCondition,
  path: require.resolve("../helpers/getBlogStaticProps.ts"),
}

module.exports = {
  remarkPlugins: [
    mdxFilePath,
    mdxExcerpt,
    mdxReadingTime,
    [mdxDefaultLayout, defaultLayoutOptions],
    [mdxDefaultGsp, defaultGspOptions],
  ],
  rehypePlugins: [
    mdxImageMetadata,
    rehypeSlug,
    rehypeAutolinkHeadings,
    rehypeDowngradeH1,
    mdxOutline,
    mdxPrism,
  ],
}
