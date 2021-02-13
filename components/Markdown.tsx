/* eslint-disable react/jsx-props-no-spreading */
/** @jsxImportSource theme-ui */
import React, { ImgHTMLAttributes, ReactElement } from "react"
import ReactMarkdown from "react-markdown/with-html"
import { Renderer, renderers as defaultRenderers } from "react-markdown"
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
    <div sx={{ position: "relative", height: height || "25rem" }}>
      {/* @ts-ignore  */}
      <LazyImage
        src={src || ""}
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

// @ts-ignore
const ParsedHtml: React.FC<{ element: ReactElement }> = ({
  element,
  ...rest
}) => {
  if (element.type === "img") {
    return <ImageRenderer {...element.props} />
  }
  return (defaultRenderers.parsedHtml as Renderer<any>)({ element, ...rest })
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
  parsedHtml: ParsedHtml,
} as const

export const Markdown: React.FC<{ source: string }> = ({ source }) => (
  <ReactMarkdown
    key="content"
    source={source}
    renderers={renderers}
    allowDangerousHtml
    disallowedTypes={[]}
  />
)
