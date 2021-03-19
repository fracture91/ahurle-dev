const { readFileSync } = require("fs")
const { join } = require("path")

const browsersList = readFileSync(
  join(__dirname, ".browserslistrc"),
  "utf8"
).split("\n")

module.exports = {
  presets: [
    [
      "next/babel",
      {
        "preset-react": { runtime: "automatic" },
        "preset-env": {
          targets: browsersList,
        },
      },
    ],
  ],
  plugins: [
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
}
