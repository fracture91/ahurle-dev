/* eslint-disable no-console */
import RSS from "rss"
import fs from "fs"
import ReactDOMServer from "react-dom/server"
import { globals } from "./globals"
import { MetaAndContent } from "./loader"

export const generateRSS = async (
  posts: MetaAndContent<true>[]
): Promise<void> => {
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
    pubDate: new Date(posts[0]?.meta.datePublished).toISOString(),
    ttl: 60,
  })

  posts.forEach(({ meta: post, content }) => {
    const html = ReactDOMServer.renderToStaticMarkup(
      content({ processedMeta: post })
    )
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
  const path = `${process.cwd()}/public/rss.xml`
  fs.writeFileSync(path, feed.xml(), "utf8")
  console.log("generated RSS feed")
}
