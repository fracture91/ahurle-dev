import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document"
import createEmotionServer from "@emotion/server/create-instance"
import createCache from "@emotion/cache"

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const cache = createCache({ key: "css" })
    const { extractCritical } = createEmotionServer(cache)
    const originalRenderPage = ctx.renderPage
    ctx.renderPage = () =>
      originalRenderPage({
        // @ts-ignore: todo
        enhanceApp: (App) => (props) => <App {...props} cache={cache} />,
      })
    const initialProps = await Document.getInitialProps(ctx)
    const styles = extractCritical(initialProps.html)

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style
            data-emotion={`css ${styles.ids.join(" ")}`}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: styles.css }}
          />
        </>
      ),
    }
  }

  render(): JSX.Element {
    return (
      <Html lang="en-US">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
