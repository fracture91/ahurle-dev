import React from "react"
import style from "react-syntax-highlighter/dist/cjs/styles/prism/darcula"

// Note that PrismAsyncLight will create one chunk for every language.
// This is better than shipping every language together in one big chunk, but it would be even better if I could not
// bother compiling anything besides the ~dozen languages I care about.
// I've applied a patch to react-syntax-highlighter/dist/esm/async-languages/prism.js
// to remove unwanted languages, which seems to achieve what I want.
import { PrismLight, PrismAsyncLight } from "react-syntax-highlighter"

const SyntaxHighlighter =
  typeof window === "undefined" ? PrismLight : PrismAsyncLight

const languageLongNames = {
  ts: "typescript",
  sh: "bash",
} as const

const DEFAULT_LANGUAGE = "typescript"

export default class Code extends React.PureComponent<{
  language: string
  value?: string
}> {
  render() {
    const { language, value } = this.props
    return (
      <SyntaxHighlighter
        language={
          languageLongNames[language as keyof typeof languageLongNames] ||
          language ||
          DEFAULT_LANGUAGE
        }
        style={style}
      >
        {value}
      </SyntaxHighlighter>
    )
  }
}
