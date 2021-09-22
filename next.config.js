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

/** @type import("next/dist/server/config").NextConfig */
module.exports = withPlugins(
  [
    bundleAnalyzer,
    [
      images,
      {
        esModule: true,
        inlineImageLimit: false,
        // default is 32 md5 hex chars - ~48 bits is plenty
        // note that support for this option is patched-in
        name: "[name].[hash:base64:8].[ext]",
      },
    ],
    mdx,
  ],
  {
    // esModule: true,
    // inlineImageLimit: false,
    webpack5: false, // "importSource cannot be set when runtime is classic" in MDX files
    pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
    reactStrictMode: true,
    images: {
      disableStaticImages: true, // disabled with webpack5: false, just being explicit
      // https://nextjs.org/docs/basic-features/image-optimization#device-sizes
      // more accurate to think of this as "widths largest optimized images will be shown at"
      // these numbers have been tweaked from default because my main page area can only be 42em wide
      deviceSizes: [
        640, // iphone 5 (320 logical px) * 2x DPR
        760, // main content width at 1x DPR
        948, // midpoint
        1136, // iphone 5 landscape (568 logical px) * 2x DPR
        1328, // midpoint
        1520, // main content width at 2x DPR
        // 1680, // main content width on 2k screen * 2x DPR (base font size increases)
        1920, // max out at 1080p arbitrarily, but probably no way to reach it
        // 2760, // main content width at 4k * 3x max DPR
        // this is an upper bound but I don't know if 4k * 3x DPR even exists, so not worth it
      ],
    },
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
    async redirects() {
      return [
        {
          source: "/recipes/workflowy",
          destination: "https://workflowy.com/s/known-recipes/ZAsUuIrpIiAvDKNG",
          permanent: false,
        },
        {
          source: "/newsletter",
          destination: "https://tinyletter.com/ahurle",
          permanent: false,
        },
      ]
    },
  }
)
