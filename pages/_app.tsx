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
import "styles/base.css"

const GlobalStyle = (
  <Global
    styles={css`
      html,
      body,
      #__next {
        min-height: 100%;
        padding: 0;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }
    `}
  />
)

// HACK: grab theme-ui's generated styles from non-exported function - see /patches
// Use this to apply dark mode styles under a media query so they work without JS
const themeUIStyles: CSSObject = createColorStyles(theme)

const DarkMediaStyle = (
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
  <div className="container">
    <CacheProvider value={cache}>
      {GlobalStyle}
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
        {DarkMediaStyle}
        {/* when JS enabled, blocks rendering until preferred scheme read from localstorage/media */}
        <InitializeColorMode key="theme-ui-no-flash" />
        <Header />
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </CacheProvider>
  </div>
)

export default App
