import { GetStaticProps } from "next"
import removeUndefined from "rundef"
import { PageMeta } from "@/helpers/schema"
import { PagePath } from "@/helpers/BlogPostPath"
import { PageLayoutProps, processRawPageMeta } from "@/helpers/loader"
import type { AddArgument } from "@/helpers/AddArgument"

export type PageStaticProps = { processedMeta: PageMeta }

export const getPageStaticProps: AddArgument<
  GetStaticProps<PageStaticProps>,
  PageLayoutProps
> = async (_context, layoutProps) => {
  const { path: rawPath } = layoutProps
  const path = PagePath.relativeToRoot(rawPath)
  return processRawPageMeta({ module: layoutProps, path }).then(
    (processedMeta) => ({
      props: {
        // next doesn't like it when you have "undefined" because that can't serialize to JSON
        processedMeta: removeUndefined(processedMeta, false, true),
      },
    })
  )
}
