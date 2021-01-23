import React from "react"
import ReactMarkdown from "react-markdown/with-html"
import Code from "./Code"

export const Markdown: React.FC<{ source: string }> = ({ source }) => (
  <div style={{ width: "100%" }} className="devii-markdown">
    <ReactMarkdown
      key="content"
      source={source}
      renderers={{
        code: Code,
      }}
      escapeHtml={false}
    />
  </div>
)
