/* eslint-disable no-console */
import RSS from "rss"
import fs from "fs"
import { renderToStaticMarkup } from "react-dom/server"
import { CacheProvider, EmotionCache } from "@emotion/react"
import * as globals from "./globals"
import { MetaAndContent } from "./loader"

const rssUrlPath = "/rss.xml"
export const rssFilePath = `${process.cwd()}/public${rssUrlPath}`

// https://github.com/emotion-js/emotion/issues/1917#issuecomment-650122202
// This is a stub that will omit <style> tags when I renderToStaticMarkup
const NoopEmotionCache: EmotionCache = {
  inserted: {},
  sheet: null as never,
  key: "",
  registered: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  insert(..._args) {},
}

const withinHtmlTag = (regex: RegExp): RegExp => {
  const original = /(?<=<[a-z0-9]+\b[^>]*)sentinel(?=[^>]*>)/
  return new RegExp(original.source.replace("sentinel", regex.source), "g")
}

export const cleanHtml = (html: string): string => {
  let cleaned = html
  // because this is simpler than breaking out an HTML parser,
  // remove any class="..." or style="...". RSS readers will generally ignore them anyway.
  cleaned = cleaned.replace(withinHtmlTag(/ (class|style)="[^"]*"/), "")
  // replace relative URLs with absolute ones
  cleaned = cleaned.replace(withinHtmlTag(/ (src|href)="(\/[^"]*)"/), (match) =>
    match.replace("/", `${globals.url}/`)
  )
  return cleaned
}

export const generateRSS = async (
  posts: MetaAndContent<true>[],
  pretty = false
): Promise<string> => {
  const feed = new RSS({
    title: globals.siteName,
    description: globals.siteDescription,
    feed_url: `${globals.url}${rssUrlPath}`,
    site_url: globals.url,
    image_url: `${globals.url}/img/logo.png`,
    managingEditor: globals.email,
    webMaster: globals.email,
    copyright: `${new Date().getFullYear()} ${globals.yourName}`,
    language: "en",
    pubDate: new Date(posts[0]?.meta.datePublished).toISOString(),
    ttl: 60,
  })

  posts.forEach(({ meta: post, content: Content }) => {
    let html = ""
    // sigh... next-page-tester 0.24.1 makes this raise an exception
    // I tried and failed to make a minimum reproducible test case
    if (process.env.NODE_ENV !== "test") {
      html = renderToStaticMarkup(
        <CacheProvider value={NoopEmotionCache}>
          <Content
            // @ts-ignore: don't want to bother typing this correctly
            processedMeta={post}
          />
        </CacheProvider>
      )
    }
    html = cleanHtml(html)
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

  const xml = feed.xml({ indent: pretty ? "  " : false })
  // writes RSS.xml to public directory
  fs.writeFileSync(rssFilePath, xml, "utf8")
  // annoying output in tests, but helpful elsewhere since when this happens it can make
  // dev mode behave strangely, e.g. preventing navigation
  if (process.env.NODE_ENV !== "test") console.log("generated RSS feed")
  return xml
}
