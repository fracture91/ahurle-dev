/** @jsxImportSource theme-ui */
import type { PageLayoutProps } from "@/helpers/loader"
import { Themed } from "theme-ui"
import { Middle, Top } from "@/components/PageSection"
import { PageStaticProps } from "@/helpers/getPageStaticProps"
import { PageMeta } from "@/helpers/schema"
import { Meta } from "./Meta"

const ThisHead: React.FC<{ meta: PageMeta }> = ({ meta }) => (
  <Meta
    meta={{
      title: meta.title,
      description: meta.description,
      canonicalUrl: meta.canonicalUrl,
    }}
  />
)

export const MDXPageLayout: React.FC<PageLayoutProps & PageStaticProps> = ({
  processedMeta: meta,
  children,
}) => {
  const visibleTitle = meta.visibleTitle || meta.title
  return (
    <>
      <ThisHead meta={meta} />
      <main sx={{ height: "100%" }}>
        {!meta.bare && (
          <>
            <Top>{visibleTitle && <Themed.h1>{visibleTitle}</Themed.h1>}</Top>
            <Middle>{children}</Middle>
          </>
        )}
        {meta.bare && children}
      </main>
    </>
  )
}
