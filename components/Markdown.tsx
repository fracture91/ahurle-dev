/** @jsxImportSource theme-ui */
import React, { ImgHTMLAttributes } from "react"
import ReactMarkdown from "react-markdown"
import RemarkDirective from "remark-directive"
import { Themed } from "theme-ui"
import { Code } from "./Code"
import { LazyImage } from "./LazyImage"

const Heading: React.FC<{ level: number; children: React.ReactChildren }> = ({
  level,
  children,
}) => {
  const tagName = `h${level}` as keyof typeof Themed
  const Component = Themed[tagName]
  return <Component>{children}</Component>
}

const ImageRenderer: React.FC<ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  height,
  ...rest
}) => {
  const layout = height ? "responsive" : "fill"
  return (
    // this wrapping div is necessary when layout == "fill", does no harm for responsive
    <div
      sx={{
        position: "relative",
        height: layout === "fill" ? height || "25rem" : "auto",
      }}
    >
      <LazyImage
        // @ts-ignore
        src={src}
        height={height}
        {...rest}
        layout={layout}
        objectFit="contain"
      />
    </div>
  )
}

const UnwrapImages: React.FC<any> = ({ children, ...rest }) => {
  const hasImage = !!React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === ImageRenderer
  )
  return hasImage ? children : <Themed.p {...rest}>{children}</Themed.p>
}

// not exhaustive
interface Node {
  attributes: { [k: string]: string } // { height: "452", ...}
  children: any[] // also present next to Node?
  name: string // "img"
  type: string // "leafDirective"
}

const Directive: React.FC<{ node: Node }> = ({ node, children }) => {
  if (node.name === "img") {
    return <ImageRenderer {...node.attributes} />
  }
  return React.createElement(node.name, node.attributes, children)
}

const renderers = {
  code: Code,
  paragraph: UnwrapImages,
  // break: "br",
  emphasis: Themed.em,
  strong: Themed.strong,
  thematicBreak: Themed.thematicBreak,
  blockquote: Themed.blockquote,
  delete: Themed.del,
  link: Themed.a,
  image: ImageRenderer,
  linkReference: Themed.a,
  imageReference: ImageRenderer,
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
  heading: Heading,
  inlineCode: Themed.code,
  // html: VirtualHtml,
  // virtualHtml: VirtualHtml,
  // parsedHtml: ParsedHtml,
  leafDirective: Directive,
  textDirective: Directive,
  containerDirective: Directive,
} as const

export const Markdown: React.FC<{ source: string }> = ({ source }) => (
  <ReactMarkdown
    key="content"
    source={source}
    renderers={renderers}
    plugins={[RemarkDirective]}
  />
)
