// @ts-check

// @ts-ignore
const mdxPrism = require("mdx-prism")
const mdxFilePath = require("./mdxFilePath")
const mdxDefaultLayout = require("./mdxDefaultLayout")
const mdxDefaultGsp = require("./mdxDefaultGetStaticProps")

/** @type {import("./mdxDefaultLayout").Layout["condition"]} */
const blogCondition = (_tree, file) =>
  file?.path?.startsWith(`${process.cwd()}/pages/blog`) || false

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
    [mdxDefaultLayout, defaultLayoutOptions],
    [mdxDefaultGsp, defaultGspOptions],
  ],
  rehypePlugins: [mdxPrism],
}
