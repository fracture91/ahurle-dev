/** @jsxImportSource theme-ui */
import React from "react"
import Head from "next/head"
import { AppProps } from "next/app"
import { Global, CacheProvider, css } from "@emotion/react"
import { cache } from "@emotion/css"
import { ThemeProvider, InitializeColorMode, CSSObject } from "theme-ui"
import { createColorStyles } from "@theme-ui/color-modes"
import { theme } from "helpers/theme"
import { Footer } from "components/Footer"
import { globals } from "helpers/globals"
import { Header } from "components/Header"
import { CSSReset } from "components/CSSReset"

// HACK: grab theme-ui's generated styles from non-exported function - see /patches
// Use this to apply dark mode styles under a media query so they work without JS
const themeUIStyles: CSSObject = createColorStyles(theme)

const DarkMediaStyle: React.FC = () => (
  <Global
    styles={css`
      @media (prefers-color-scheme: dark) {
        body {
          ${(themeUIStyles.body as CSSObject)["&.theme-ui-dark"]}
        }
      }
    `}
  />
)

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <CacheProvider value={cache}>
    {CSSReset}
    <Head>
      {globals.googleAnalyticsId && (
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${globals.googleAnalyticsId}`}
        />
      )}
      {globals.googleAnalyticsId && (
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('globals', '${globals.googleAnalyticsId}');
            `,
          }}
        />
      )}
    </Head>
    <ThemeProvider theme={theme}>
      {/* important: prefers-color-scheme rules come after built-in theme-ui rules */}
      <DarkMediaStyle />
      {/* when JS enabled, blocks rendering until preferred scheme read from localstorage/media */}
      <InitializeColorMode key="theme-ui-no-flash" />
      <Header />
      <Component {...pageProps} />
      <Footer />
    </ThemeProvider>
  </CacheProvider>
)

export default App
