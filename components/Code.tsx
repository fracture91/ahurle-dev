/** @jsxImportSource theme-ui */
import React, { useMemo } from "react"
import style from "react-syntax-highlighter/dist/cjs/styles/prism/darcula"

// Note that PrismAsyncLight will create one chunk for every language.
// This is better than shipping every language together in one big chunk, but it would be even better if I could not
// bother compiling anything besides the ~dozen languages I care about.
// I've applied a patch to react-syntax-highlighter/dist/esm/async-languages/prism.js
// to remove unwanted languages, which seems to achieve what I want.
import { PrismLight, PrismAsyncLight } from "react-syntax-highlighter"
import type { ThemeUICSSObject } from "theme-ui"
import { useThemeUI } from "helpers/theme"

const SyntaxHighlighter =
  typeof window === "undefined" ? PrismLight : PrismAsyncLight


const languageLongNames = {
  ts: "typescript",
  sh: "bash",
} as const

const DEFAULT_LANGUAGE = "text"

const originalPreSelector = 'pre[class*="language-"]'
const originalCodeSelector = 'code[class*="language-"]'

// The prism style object is *almost* the same shape as an emotion CSS object.
// There are a couple weird things we have to fix:
//   1. there are classname selectors missing their leading dot
//   2. selectors for "pre[...]" refer to the current element, so should be replaced with "&"
const fixedStyle = (() => {
  let memo: ThemeUICSSObject
  return () => {
    if (memo) return memo
    memo = { ...(style as { [key: string]: any }) }
    Object.keys(memo).forEach((k) => {
      if (/^[a-z]/i.test(k) && !/^(pre|code)\b/.test(k)) {
        memo[`.${k}`] = memo[k]
        delete memo[k]
      } else {
        const fixedKey = k.replace(originalPreSelector, "&")
        if (fixedKey !== k) {
          memo[fixedKey] = memo[k]
          delete memo[k]
        }
      }
    })
    return memo
  }
})()

export const Code: React.FC<{ language: string; value?: string }> = React.memo(
  ({ language, value }) => {
    const effectiveLanguage =
      (languageLongNames as { [key: string]: string })[language] ||
      language ||
      DEFAULT_LANGUAGE

    const codeTagProps = useMemo(
      () => ({
        // see https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/efc3f7b7537d1729193b7a472067bcbe6cbecaf1/src/highlight.js#L321
        className: effectiveLanguage
          ? `language-${effectiveLanguage}`
          : undefined,
        style: {},
      }),
      [effectiveLanguage]
    )

    const { theme } = useThemeUI()
    // Make sure the theme's default styles for <pre> and <code> apply here.
    // Unfortunately, the theme's rules will run through theme-ui's machinery even
    // though emotion alone should suffice.
    // I tried several other tricks (css prop, merging css() calls, PreTag={Themed.pre})
    // but none of them worked the way I wanted.
    const sx: ThemeUICSSObject = useMemo(
      () => ({
        ...fixedStyle(),
        ...{
          "&": { ...(fixedStyle()["&"] as object), ...theme.styles.pre },
          [originalCodeSelector]: {
            ...(fixedStyle()[originalCodeSelector] as object),
            ...theme.styles.code,
            ...theme.styles.code["pre &"],
          },
        },
      }),
      [theme.styles.pre, theme.styles.code]
    )

    return (
      <SyntaxHighlighter
        language={effectiveLanguage}
        // instead of repeating inline styles on every instance of this component,
        // put them in the doc head once like any other emotion CSS
        // style={style}
        useInlineStyles={false}
        // without the next line, useInlineStyles=false has no effect on code tag
        // https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/329
        codeTagProps={codeTagProps}
        sx={sx}
      >
        {value}
      </SyntaxHighlighter>
    )
  }
)
