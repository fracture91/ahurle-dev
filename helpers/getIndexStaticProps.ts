import { GetStaticProps, GetStaticPropsResult } from "next"
import removeUndefined from "rundef"
import { BlogMeta } from "@/helpers/schema"
// import { generateRSS } from "@/helpers/rssUtil"
import { PageLayoutProps, loadPublishedBlogs } from "@/helpers/loader"
import {
  getPageStaticProps,
  PageStaticProps,
} from "@/helpers/getPageStaticProps"
import type { AddArgument } from "@/helpers/AddArgument"

export type IndexStaticProps = PageStaticProps & { posts: BlogMeta<true>[] }

const hasProps = <T extends GetStaticPropsResult<PageStaticProps>>(
  t: T
): t is T & { props: PageStaticProps } =>
  Object.prototype.hasOwnProperty.call(t, "props")

export const getIndexStaticProps: AddArgument<
  GetStaticProps<IndexStaticProps>,
  PageLayoutProps
> = async (context, layoutProps) => {
  const pageStaticProps = await getPageStaticProps(context, layoutProps)
  if (!hasProps(pageStaticProps)) return pageStaticProps
  const posts = await loadPublishedBlogs()

  // comment out to turn off RSS generation during build step.
  // await generateRSS(posts)

  return {
    ...pageStaticProps,
    props: {
      ...pageStaticProps.props,
      posts: posts.map(({ meta }) => removeUndefined(meta, false, true)),
    },
  }
}
