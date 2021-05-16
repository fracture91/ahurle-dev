import { ThemeProvider, Themed } from "theme-ui"
import Link from "next/link"
import { theme } from "@/helpers/theme"
import { prismStyle } from "@/helpers/prismStyle"
import { ImageRenderer } from "@/components/ImageRenderer"
import { UnwrapImages } from "@/components/UnwrapImages"
import { Figcaption } from "@/components/Figcaption"
import React from "react"
import type { MDXProviderComponents } from "@theme-ui/mdx"

const MDXPre: React.FC<React.ComponentPropsWithoutRef<"pre">> = React.memo(
  (props) => <Themed.pre {...props} sx={prismStyle} />
)

const MDXLink: React.FC<React.ComponentPropsWithoutRef<"a">> = ({
  children,
  href,
  ...props
}) => {
  if (href?.startsWith("/") || href?.startsWith("#"))
    return (
      <Link href={href} passHref>
        <Themed.a {...props}>{children}</Themed.a>
      </Link>
    )
  return (
    <Themed.a href={href} {...props}>
      {children}
    </Themed.a>
  )
}

const components: MDXProviderComponents = {
  p: UnwrapImages,
  ul: (props) => <Themed.ul {...props} sx={{ fontFamily: "prose" }} />,
  ol: (props) => <Themed.ol {...props} sx={{ fontFamily: "prose" }} />,
  pre: MDXPre,
  img: ImageRenderer,
  a: MDXLink,
  inlineCode: Themed.code,
  figcaption: Figcaption,
  figure: (props) => <figure {...props} sx={{ my: 3 }} />,
}

export const MyThemeProvider: React.FC = (props) => (
  <ThemeProvider theme={theme} components={components} {...props} />
)
