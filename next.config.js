// eslint-disable-next-line import/no-extraneous-dependencies
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  trailingSlash: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    })
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias = {
      ...config.resolve.alias,
      "~": __dirname,
    }
    return config
  },
})
