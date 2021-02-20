/* eslint-disable import/order */
// eslint-disable-next-line import/no-extraneous-dependencies
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const mdxOptions = require("./config/mdxOptions")

const withMDX = require("@next/mdx")({
  options: mdxOptions,
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
