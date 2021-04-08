/* eslint-disable no-console */
import RSS from "rss"
import fs from "fs"
import { renderToStaticMarkup } from "react-dom/server"
import * as globals from "./globals"
import { MetaAndContent } from "./loader"

export const rssFilePath = `${process.cwd()}/public/rss.xml`

export const generateRSS = async (
  posts: MetaAndContent<true>[]
): Promise<void> => {
  const feed = new RSS({
    title: globals.siteName,
    description: globals.siteDescription,
    feed_url: `${globals.url}/rss.xml`,
    site_url: globals.url,
    image_url: `${globals.url}/img/logo.png`,
    managingEditor: globals.email,
    webMaster: globals.email,
    copyright: `${new Date().getFullYear()} ${globals.yourName}`,
    language: "en",
    pubDate: new Date(posts[0]?.meta.datePublished).toISOString(),
    ttl: 60,
  })

  posts.forEach(({ meta: post, content }) => {
    let html = ""
    // sigh... next-page-tester 0.24.1 makes this raise an exception
    // I tried and failed to make a minimum reproducible test case
    if (process.env.NODE_ENV !== "test") {
      html = renderToStaticMarkup(content({ processedMeta: post }))
    }
    feed.item({
      title: post.title,
      description: post.description,
      custom_elements: [{ "content:encoded": { _cdata: html } }],
      url: post.canonicalUrl,
      categories: post.tags,
      author: post.author?.name,
      date: new Date(post.datePublished).toISOString(),
    })
  })

  // writes RSS.xml to public directory
  fs.writeFileSync(rssFilePath, feed.xml(), "utf8")
  // annoying output in tests, but helpful elsewhere since when this happens it can make
  // dev mode behave strangely, e.g. preventing navigation
  if (process.env.NODE_ENV !== "test") console.log("generated RSS feed")
}
