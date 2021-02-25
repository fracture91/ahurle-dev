/* eslint-disable import/order */
// @ts-check
// @ts-ignore: missing types
const withPlugins = require("next-compose-plugins")

// @ts-ignore: missing types
// eslint-disable-next-line import/no-extraneous-dependencies
const bundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const mdxOptions = require("./config/mdxOptions")

// @ts-ignore: missing types
const mdx = require("@next/mdx")({ options: mdxOptions })

// @ts-ignore: missing types
const images = require("next-images")

/** @type import("next/dist/next-server/server/config").NextConfig */
module.exports = withPlugins(
  [bundleAnalyzer, [images, { esModule: true, inlineImageLimit: false }], mdx],
  {
    // esModule: true,
    // inlineImageLimit: false,
    pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
    reactStrictMode: true,
    /** @param {import("webpack").Configuration} config */
    webpack(config) {
      config.module?.rules.push({
        test: /\.md$/,
        use: "raw-loader",
      })
      const nextImagesRule = config.module?.rules.find((rule) =>
        rule.test?.toString().includes("jpeg")
      )
      if (!nextImagesRule || !Array.isArray(nextImagesRule?.use)) {
        throw new Error("Could not find next-images rule")
      }
      nextImagesRule.use?.unshift({
        loader: "./config/imageSizeLoader",
      })
      return config
    },
  }
)
