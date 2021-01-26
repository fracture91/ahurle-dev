import React from "react"
import Head from "next/head"
import { AppProps } from "next/app"
import { createGlobalStyle, ThemeProvider } from "styled-components"
import { Footer } from "components/Footer"
import { globals } from "helpers/globals"
import { Header } from "components/Header"
import "styles/base.css"

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #__next {
    min-height: 100%;
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  * {
    box-sizing: border-box;
  }
`

const theme = {
  colors: {
    primary: "#0070f3",
  },
}

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <div className="container">
    <GlobalStyle />
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
      <Header />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
      <Footer />
    </ThemeProvider>
  </div>
)

export default App
