/* eslint-disable import/order */
// @ts-check
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const mdxOptions = require("./config/mdxOptions")

// @ts-ignore
const withMDX = require("@next/mdx")({
  options: mdxOptions,
})

/** @type import("next/dist/next-server/server/config").NextConfig */
module.exports = withBundleAnalyzer(
  withMDX({
    pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
    reactStrictMode: true,
    /** @param {import("webpack").Configuration} config */
    webpack(config) {
      config.module?.rules.push({
        test: /\.md$/,
        use: "raw-loader",
      })
      return config
    },
  })
)
