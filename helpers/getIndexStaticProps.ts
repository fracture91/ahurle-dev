import { GetStaticProps, GetStaticPropsResult } from "next"
import removeUndefined from "rundef"
import { BlogMeta } from "@/helpers/schema"
import { generateRSS } from "@/helpers/rssUtil"
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

  /**
   * As written, the dev server will prevent navigation upon writing to the /public dir.
   * Ideally, this step would be a postbuild script instead.  Or even more ideally, we
   * could have a `pages/rss.xml.tsx` containing a `getStaticProps` to generate the file.
   *
   * It's possible to do this with `getServerSideProps`, but that would break `next export`:
   * https://github.com/vercel/next.js/discussions/12403#discussioncomment-10225
   *
   * It's also possible to execute a plain old node script with node/ts-node/babel-node,
   * but I want to execute code that has been through the next.js build pipeline and I
   * don't want to set up an entire parallel build system for one script:
   * https://www.joshwcomeau.com/blog/how-i-built-my-blog/#build-helpers
   * https://leerob.io/blog/nextjs-sitemap-robots#dynamic-sitemaps
   * https://github.com/vercel/next.js/pull/15276#issuecomment-660336199
   *
   * I tried this hack to build a script through next.js, but I gave up on it.
   * Might be possible but not worth the effort.
   * https://dev.to/nalanj/adding-scripts-to-next-js-n7i
   * https://github.com/fracture91/ahurle-dev/commit/3000dc54f07550aeee6665f2e5d84b61a2d268bb
   *
   * So... let's stick with this :/
   */
  // comment out to turn off RSS generation during build step.
  await generateRSS(posts)

  return {
    ...pageStaticProps,
    props: {
      ...pageStaticProps.props,
      posts: posts.map(({ meta }) => removeUndefined(meta, false, true)),
    },
  }
}
