/* eslint-disable no-console */
import RSS from "rss"
import fs from "fs"
import showdown from "showdown"
import { globals } from "./globals"
import { BlogMeta } from "./loader"

export const generateRSS = async (posts: BlogMeta<true>[]): Promise<void> => {
  posts.map((post) => {
    if (!post.canonicalUrl)
      throw new Error(
        "Missing canonicalUrl. A canonical URL is required for RSS feed generation. If you don't care about RSS, uncomment `generateRSS(posts)` at the bottom of index.tsx."
      )
    return post
  })

  const feed = new RSS({
    title: globals.siteName,
    description: globals.siteDescription,
    feed_url: `${globals.url}/rss.xml`,
    site_url: globals.url,
    image_url: `${globals.url}/icon.png`,
    managingEditor: globals.email,
    webMaster: globals.email,
    copyright: `${new Date().getFullYear()} ${globals.yourName}`,
    language: "en",
    pubDate: globals.siteCreationDate,
    ttl: 60,
  })

  let isValid = true
  posts.forEach((post) => {
    return // TODO
    // eslint-disable-next-line no-unreachable
    const converter = new showdown.Converter()
    // @ts-ignore
    const html = converter.makeHtml(post.content)
    if (!post.datePublished) {
      isValid = false
      console.error(
        "All posts must have a publishedDate timestamp when generating RSS feed."
      )
      console.error("Not generating rss.xml.")
    }
    feed.item({
      title: post.title,
      description: html,
      url: `${globals.url}/${post.urlPath}`,
      categories: post.tags || [],
      author: post.author?.name || "Andrew Hurle",
      date: new Date(post.datePublished || 0).toISOString(),
    })
  })

  if (!isValid) return

  // writes RSS.xml to public directory
  const path = `${process.cwd()}/public/rss.xml`
  fs.writeFileSync(path, feed.xml(), "utf8")
  console.log("generated RSS feed")
}
