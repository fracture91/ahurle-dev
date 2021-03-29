import type { ThemeUICSSObject } from "theme-ui"

const originalPreSelector = 'pre[class*="language-"]'
export const originalCodeSelector = 'code[class*="language-"]'

// darcula style copied from https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/efc3f7b7537d1729193b7a472067bcbe6cbecaf1/src/styles/prism/darcula.js
// MIT License
// Copyright (c) 2019 Conor Hastings
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
const style = {
  "code[class*=\"language-\"]": {
      "color": "#a9b7c6",
      "fontFamily": "Consolas, Monaco, 'Andale Mono', monospace",
      "direction": "ltr",
      "textAlign": "left",
      "whiteSpace": "pre",
      "wordSpacing": "normal",
      "wordBreak": "normal",
      "lineHeight": "1.5",
      "MozTabSize": "4",
      "OTabSize": "4",
      "tabSize": "4",
      "WebkitHyphens": "none",
      "MozHyphens": "none",
      "msHyphens": "none",
      "hyphens": "none"
  },
  "pre[class*=\"language-\"]": {
      "color": "#a9b7c6",
      "fontFamily": "Consolas, Monaco, 'Andale Mono', monospace",
      "direction": "ltr",
      "textAlign": "left",
      "whiteSpace": "pre",
      "wordSpacing": "normal",
      "wordBreak": "normal",
      "lineHeight": "1.5",
      "MozTabSize": "4",
      "OTabSize": "4",
      "tabSize": "4",
      "WebkitHyphens": "none",
      "MozHyphens": "none",
      "msHyphens": "none",
      "hyphens": "none",
      "padding": "1em",
      "margin": ".5em 0",
      "overflow": "auto",
      "background": "#2b2b2b"
  },
  "pre[class*=\"language-\"]::-moz-selection": {
      "color": "inherit",
      "background": "rgba(33, 66, 131, .85)"
  },
  "pre[class*=\"language-\"] ::-moz-selection": {
      "color": "inherit",
      "background": "rgba(33, 66, 131, .85)"
  },
  "code[class*=\"language-\"]::-moz-selection": {
      "color": "inherit",
      "background": "rgba(33, 66, 131, .85)"
  },
  "code[class*=\"language-\"] ::-moz-selection": {
      "color": "inherit",
      "background": "rgba(33, 66, 131, .85)"
  },
  "pre[class*=\"language-\"]::selection": {
      "color": "inherit",
      "background": "rgba(33, 66, 131, .85)"
  },
  "pre[class*=\"language-\"] ::selection": {
      "color": "inherit",
      "background": "rgba(33, 66, 131, .85)"
  },
  "code[class*=\"language-\"]::selection": {
      "color": "inherit",
      "background": "rgba(33, 66, 131, .85)"
  },
  "code[class*=\"language-\"] ::selection": {
      "color": "inherit",
      "background": "rgba(33, 66, 131, .85)"
  },
  ":not(pre) > code[class*=\"language-\"]": {
      "background": "#2b2b2b",
      "padding": ".1em",
      "borderRadius": ".3em"
  },
  "comment": {
      "color": "#808080"
  },
  "prolog": {
      "color": "#808080"
  },
  "cdata": {
      "color": "#808080"
  },
  "delimiter": {
      "color": "#cc7832"
  },
  "boolean": {
      "color": "#cc7832"
  },
  "keyword": {
      "color": "#cc7832"
  },
  "selector": {
      "color": "#cc7832"
  },
  "important": {
      "color": "#cc7832"
  },
  "atrule": {
      "color": "#cc7832"
  },
  "operator": {
      "color": "#a9b7c6"
  },
  "punctuation": {
      "color": "#a9b7c6"
  },
  "attr-name": {
      "color": "#a9b7c6"
  },
  "tag": {
      "color": "#e8bf6a"
  },
  "tag.punctuation": {
      "color": "#e8bf6a"
  },
  "doctype": {
      "color": "#e8bf6a"
  },
  "builtin": {
      "color": "#e8bf6a"
  },
  "entity": {
      "color": "#6897bb"
  },
  "number": {
      "color": "#6897bb"
  },
  "symbol": {
      "color": "#6897bb"
  },
  "property": {
      "color": "#9876aa"
  },
  "constant": {
      "color": "#9876aa"
  },
  "variable": {
      "color": "#9876aa"
  },
  "string": {
      "color": "#6a8759"
  },
  "char": {
      "color": "#6a8759"
  },
  "attr-value": {
      "color": "#a5c261"
  },
  "attr-value.punctuation": {
      "color": "#a5c261"
  },
  "attr-value.punctuation:first-child": {
      "color": "#a9b7c6"
  },
  "url": {
      "color": "#287bde",
      "textDecoration": "underline"
  },
  "function": {
      "color": "#ffc66d"
  },
  "regex": {
      "background": "#364135"
  },
  "bold": {
      "fontWeight": "bold"
  },
  "italic": {
      "fontStyle": "italic"
  },
  "inserted": {
      "background": "#294436"
  },
  "deleted": {
      "background": "#484a4a"
  },
  "code.language-css .token.property": {
      "color": "#a9b7c6"
  },
  "code.language-css .token.property + .token.punctuation": {
      "color": "#a9b7c6"
  },
  "code.language-css .token.id": {
      "color": "#ffc66d"
  },
  "code.language-css .token.selector > .token.class": {
      "color": "#ffc66d"
  },
  "code.language-css .token.selector > .token.attribute": {
      "color": "#ffc66d"
  },
  "code.language-css .token.selector > .token.pseudo-class": {
      "color": "#ffc66d"
  },
  "code.language-css .token.selector > .token.pseudo-element": {
      "color": "#ffc66d"
  }
}

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
