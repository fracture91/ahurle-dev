import type { ThemeUICSSObject } from "theme-ui"

export const codeSelector = 'code[class*="language-"]'

// darcula style copied from https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/efc3f7b7537d1729193b7a472067bcbe6cbecaf1/src/styles/prism/darcula.js
// MIT License
// Copyright (c) 2019 Conor Hastings
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
export const prismStyle: ThemeUICSSObject = {
  [codeSelector]: {
    color: "#a9b7c6",
    fontFamily: "Consolas, Monaco, 'Andale Mono', monospace",
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: "1.5",
    MozTabSize: "4",
    OTabSize: "4",
    tabSize: "4",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
  },
  "&": {
    color: "#a9b7c6",
    fontFamily: "Consolas, Monaco, 'Andale Mono', monospace",
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: "1.5",
    MozTabSize: "4",
    OTabSize: "4",
    tabSize: "4",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
    padding: "1em",
    margin: ".5em 0",
    overflow: "auto",
    background: "#2b2b2b",
  },
  [`&::selection, & ::selection, ${codeSelector}::selection, ${codeSelector} ::selection`]: {
    color: "inherit",
    background: "rgba(33, 66, 131, .85)",
  },
  [`:not(pre) > ${codeSelector}`]: {
    background: "#2b2b2b",
    padding: ".1em",
    borderRadius: ".3em",
  },
  ".comment, .prolog, .cdata": {
    color: "#808080",
  },
  ".delimiter, .boolean, .keyword, .selector, .important, .atrule": {
    color: "#cc7832",
  },
  ".operator, .punctuation, .attr-name": {
    color: "#a9b7c6",
  },
  ".tag, .tag.punctuation, .doctype, .builtin": {
    color: "#e8bf6a",
  },
  ".entity, .number, .symbol": {
    color: "#6897bb",
  },
  ".property, .constant, .variable": {
    color: "#9876aa",
  },
  ".string, .char": {
    color: "#6a8759",
  },
  ".attr-value, .attr-value.punctuation": {
    color: "#a5c261",
  },
  ".attr-value.punctuation:first-child": {
    color: "#a9b7c6",
  },
  ".url": {
    color: "#287bde",
    textDecoration: "underline",
  },
  ".function": {
    color: "#ffc66d",
  },
  ".regex": {
    background: "#364135",
  },
  ".bold": {
    fontWeight: "bold",
  },
  ".italic": {
    fontStyle: "italic",
  },
  ".inserted": {
    background: "#294436",
  },
  ".deleted": {
    background: "#484a4a",
  },
  "code.language-css": {
    ".token.property": {
      "+ .token.punctuation": {
        color: "#a9b7c6",
      },
      color: "#a9b7c6",
    },
    ".token.id": {
      color: "#ffc66d",
    },
    ".token.selector": {
      "> .token.class, > .token.attribute, > .token.pseudo-class, > .token.pseudo-element": {
        color: "#ffc66d",
      },
    },
  },
}
