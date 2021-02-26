import style from "react-syntax-highlighter/dist/cjs/styles/prism/darcula"
import type { ThemeUICSSObject } from "theme-ui"

const originalPreSelector = 'pre[class*="language-"]'
export const originalCodeSelector = 'code[class*="language-"]'

// The prism style object is *almost* the same shape as an emotion CSS object.
// There are a couple weird things we have to fix:
//   1. there are classname selectors missing their leading dot
//   2. selectors for "pre[...]" refer to the current element, so should be replaced with "&"
export const fixedStyle = (() => {
  let memo: ThemeUICSSObject
  return () => {
    if (memo) return memo
    memo = { ...(style as ThemeUICSSObject) }
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
