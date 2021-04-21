import { GetStaticProps } from "next"
import removeUndefined from "rundef"
import { BlogMeta } from "@/helpers/schema"
import { BlogPostPath } from "@/helpers/BlogPostPath"
import { BlogLayoutProps, processRawBlogMeta } from "@/helpers/loader"
import type { AddArgument } from "@/helpers/AddArgument"
import fs from "fs"

export type BlogStaticProps = { processedMeta: BlogMeta }

const pagesOutput = ".next/server/pages/"

/**
 * Yikes.  In the case where I return notFound, it seems like `next export` still expects an HTML
 * file to be generated, so it throws an error trying to copy the missing HTML file to `./out`.
 *
 * You can reproduce the bug like so after removing this function call:
 *
 * ```
 * rm -rf .next
 * NODE_ENV=production NOW_BUILDER=true yarn build
 * NODE_ENV=production NOW_BUILDER=true yarn export
 * ```
 *
 * Get around this problem by writing empty HTML/JSON files so the copy operation doesn't explode.
 * As a consequence, it seems like visiting the page URL in production gives you an empty page
 * and a 200 response.  Not ideal.  But nobody should be visiting this URL if it's unpublished...
 */
const fixNextExport = (path: BlogPostPath): void => {
  const htmlPath = `${pagesOutput}${path.pathFromPagesDir.replace(
    /\..*$|$/,
    ".html"
  )}`
  const jsonPath = htmlPath.replace(/\.html$/, ".json")
  if (!fs.existsSync(htmlPath)) {
    fs.writeFileSync(htmlPath, "")
  }
  if (!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, JSON.stringify({}))
  }
}

export const getBlogStaticProps: AddArgument<
  GetStaticProps<BlogStaticProps>,
  BlogLayoutProps
> = async (_context, layoutProps) => {
  const { meta, path: rawPath } = layoutProps
  const path = BlogPostPath.relativeToRoot(rawPath)

  // you can view unpublished drafts with `yarn dev`, but they are hidden with `yarn build`
  if (!meta.published && process.env.NODE_ENV === "production") {
    fixNextExport(path)
    return { notFound: true }
  }

  return processRawBlogMeta({ module: layoutProps, path }).then(
    (processedMeta) => ({
      props: {
        // next doesn't like it when you have "undefined" because that can't serialize to JSON
        processedMeta: removeUndefined(processedMeta, false, true),
      },
    })
  )
}
