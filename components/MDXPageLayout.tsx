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
  if (meta.bare)
    return (
      <>
        <ThisHead meta={meta} />
        {children}
      </>
    )
  return (
    <>
      <ThisHead meta={meta} />
      <Top>{meta.title && <Themed.h1>{meta.title}</Themed.h1>}</Top>
      <Middle>{children}</Middle>
    </>
  )
}
