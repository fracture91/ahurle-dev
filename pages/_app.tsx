/** @jsxImportSource theme-ui */
import React from "react"
import Head from "next/head"
import { AppProps } from "next/app"
import Link from "next/link"
import { Global, CacheProvider, css } from "@emotion/react"
import { cache } from "@emotion/css"
import {
  ThemeProvider,
  InitializeColorMode,
  CSSObject,
  css as themeuicss,
  Themed,
  Flex,
} from "theme-ui"
import { createColorStyles } from "@theme-ui/color-modes"
import type { MDXProviderComponents } from "@theme-ui/mdx"
import { theme } from "@/helpers/theme"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { CSSReset } from "@/components/CSSReset"
import { prismStyle } from "@/helpers/prismStyle"
import { ImageRenderer } from "@/components/ImageRenderer"
import { UnwrapImages } from "@/components/UnwrapImages"
import { ThemeMeta } from "@/components/ThemeMeta"
import { RemovePreLoadClass } from "@/components/RemovePreLoadClass"
import { GoatCounterScript, GoatCounterPixel } from "@/components/GoatCounter"

const MDXPre: React.FC<
  React.ComponentPropsWithoutRef<"pre">
> = React.memo((props) => <Themed.pre {...props} sx={prismStyle} />)

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
}

// HACK: grab theme-ui's generated styles from non-exported function - see /patches
// Use this to apply dark mode styles under a media query so they work without JS
const themeUIStyles: CSSObject = createColorStyles(theme)

const DarkMediaStyle: React.FC = () => (
  <Global
    styles={css`
      @media (prefers-color-scheme: dark) {
        /* If there's a class on this element then JS has selected a particular mode */
        html:not([class*="theme-ui-"]) {
          ${(themeUIStyles.html as CSSObject)["&.theme-ui-dark"]}
        }
      }
    `}
  />
)

const BodyStyle: React.FC = () => (
  <Global styles={themeuicss((t) => ({ body: t?.styles?.body }))} />
)

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <CacheProvider value={cache}>
    {CSSReset}
    <Head>
      <meta httpEquiv="status" content={pageProps.statusCode || "200"} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <ThemeProvider theme={theme} components={components}>
      <ThemeMeta />
      <BodyStyle />
      {/* important: prefers-color-scheme rules come after built-in theme-ui rules */}
      <DarkMediaStyle />
      {/* when JS enabled, blocks rendering until preferred scheme read from localstorage/media */}
      <InitializeColorMode key="theme-ui-no-flash" />
      <RemovePreLoadClass />
      <Flex sx={{ flexDirection: "column", height: "100%" }}>
        <Flex sx={{ flexDirection: "column", flex: "1 0 0" }}>
          <Header />
          <div sx={{ flex: "1 0 0" }}>
            <Component {...pageProps} />
          </div>
        </Flex>
        <Footer />
      </Flex>
      <GoatCounterScript />
      <GoatCounterPixel />
    </ThemeProvider>
  </CacheProvider>
)

export default App
