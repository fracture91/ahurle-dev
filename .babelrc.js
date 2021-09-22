const { readFileSync } = require("fs")
const { join } = require("path")

const browsersList = readFileSync(
  join(__dirname, ".browserslistrc"),
  "utf8"
).split("\n")

const presets = [
  [
    "next/babel",
    {
      "preset-react": { runtime: "automatic", importSource: "theme-ui" },
      "preset-env": {
        targets: browsersList,
      },
    },
  ],
]

const mdxPresets = JSON.parse(JSON.stringify(presets))
// https://github.com/mdx-js/mdx/issues/1441
// MDX v1 uses the classic runtime and will complain about importSource
delete mdxPresets[0][1]["preset-react"].importSource

module.exports = {
  presets,
  plugins: [
    ["polished"],
    ["@emotion"],
    [
      "module-resolver",
      {
        root: ["."],
        alias: {
          "@": ".",
        },
      },
    ],
    ["./babel-plugin-nextjs-mdx-patch"],
  ],
  overrides: [
    {
      test: /^.*\.mdx$/,
      presets: mdxPresets,
    },
  ],
}
