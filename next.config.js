// eslint-disable-next-line import/no-extraneous-dependencies
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const mdxPrism = require("mdx-prism")
const mdxFilePath = require("./helpers/mdx-file-path.js")

const withMDX = require("@next/mdx")({
  options: {
    remarkPlugins: [mdxFilePath],
    rehypePlugins: [mdxPrism],
  },
})

module.exports = withBundleAnalyzer(
  withMDX({
    pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
    reactStrictMode: true,
    webpack(config) {
      config.module.rules.push({
        test: /\.md$/,
        use: "raw-loader",
      })
      return config
    },
  })
)
