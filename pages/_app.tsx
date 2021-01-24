import React from "react"
import Head from "next/head"
import { AppProps } from "next/app"
import { Footer } from "../components/Footer"
import { globals } from "../helpers/globals"
import { Header } from "../components/Header"
import "../styles/base.css"

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <div className="container">
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
    <Header />
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Component {...pageProps} />
    <Footer />
  </div>
)

export default App
