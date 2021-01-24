// eslint-disable-next-line import/no-extraneous-dependencies
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const withMDX = require("@next/mdx")({
  extension: /\.mdx/,
})

module.exports = withBundleAnalyzer(
  withMDX({
    reactStrictMode: true,
    trailingSlash: true,
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    webpack(config) {
      config.module.rules.push({
        test: /\.md$/,
        use: "raw-loader",
      })
      return config
    },
  })
)
