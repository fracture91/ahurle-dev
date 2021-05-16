import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document"
import { extractCritical } from "@emotion/server"
import { InitializeColorMode } from "theme-ui"
import { preLoadClass } from "@/components/RemovePreLoadClass"
import { SentryLoader } from "@/components/SentryLoader"
import { GoatCounterPixel } from "@/components/GoatCounterPixel"

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)
    const styles = extractCritical(initialProps.html)

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style
            // because of this emotion bug: https://github.com/emotion-js/emotion/issues/2158
            // it might be helpful to comment the next line when iterating on global styles
            // possibly fixed by extractCriticalToChunks: https://github.com/emotion-js/emotion/pull/2334
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
      <Html lang="en-US" className={preLoadClass}>
        <Head />
        <body>
          {/* when JS enabled, blocks rendering until preferred scheme read from localstorage/media */}
          <InitializeColorMode key="theme-ui-no-flash" />
          <Main />
          {/* Note that any scripts executing before this point (InitializeColorMode) won't have Sentry coverage */}
          <SentryLoader />
          <NextScript />
          {/* eslint-disable-next-line no-underscore-dangle */}
          <GoatCounterPixel {...this.props.__NEXT_DATA__} />
        </body>
      </Html>
    )
  }
}

export default MyDocument
