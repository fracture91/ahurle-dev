/** @jsxImportSource theme-ui */
import React from "react"
import ReactMarkdown from "react-markdown/with-html"
import { Themed } from "theme-ui"
import Code from "./Code"

const renderers = {
  code: Code,
  paragraph: Themed.p,
  // break: "br",
  emphasis: Themed.em,
  strong: Themed.strong,
  thematicBreak: Themed.thematicBreak,
  blockquote: Themed.blockquote,
  delete: Themed.del,
  link: Themed.a,
  image: Themed.img,
  linkReference: Themed.a,
  imageReference: Themed.img,
  table: Themed.table,
  // tableHead: SimpleRenderer.bind(null, "thead"),
  // tableBody: SimpleRenderer.bind(null, "tbody"),
  // tableRow: SimpleRenderer.bind(null, "tr"),
  // tableCell: TableCell,
  // root: Root,
  // text: TextRenderer,
  // list: Themed.ul, // default one detects ordered/unordered
  // listItem: Themed.li, // default supports checkboxes
  // definition: NullRenderer,
  // heading: Heading,
  // inlineCode: InlineCode,
  // html: Html,
  // virtualHtml: VirtualHtml,
  // parsedHtml: ParsedHtml,
} as const

export const Markdown: React.FC<{ source: string }> = ({ source }) => (
  <div style={{ width: "100%" }} className="devii-markdown">
    <ReactMarkdown
      key="content"
      source={source}
      renderers={renderers}
      escapeHtml={false}
    />
  </div>
)
