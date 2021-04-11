/* eslint-disable no-console */
import RSS from "rss"
import fs from "fs"
import { renderToStaticMarkup } from "react-dom/server"
import { CacheProvider, EmotionCache } from "@emotion/react"
import type { MDXBlogLayout } from "@/components/MDXBlogLayout"
import { MyThemeProvider } from "@/components/MyThemeProvider"
import * as globals from "./globals"
import { MetaAndContent } from "./loader"

const rssUrlPath = "/rss.xml"
export const rssFilePath = `${process.cwd()}/public${rssUrlPath}`

// https://github.com/emotion-js/emotion/issues/1917#issuecomment-650122202
// This is a stub that will omit <style> tags when I renderToStaticMarkup
const NoopEmotionCache: EmotionCache = {
  inserted: {},
  sheet: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    insert(..._args) {},
    container: (null as unknown) as HTMLElement,
    key: "",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    flush(..._args) {},
    tags: [],
  },
  key: "",
  registered: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  insert(..._args) {},
}

const withinHtmlTag = (regex: RegExp): RegExp => {
  const original = /(?<=<[a-z0-9]+\b[^>]*)sentinel(?=[^>]*>)/
  return new RegExp(original.source.replace("sentinel", regex.source), "g")
}

const myOrigin = new URL(globals.url).origin

const addUtmSource = (urlString: string): string => {
  // relative URLs are resolved relative to globals.url and changed to absolute
  const url = new URL(urlString, globals.url)
  // leave external links untouched
  if (url.origin !== myOrigin) return urlString
  url.searchParams.append("utm_source", "rss")
  return url.toString()
}

export const cleanHtml = (html: string): string => {
  let cleaned = html
  // because this is simpler than breaking out an HTML parser,
  // remove any class="..." or style="...". RSS readers will generally ignore them anyway.
  cleaned = cleaned.replace(withinHtmlTag(/ (class|style)="[^"]*"/), "")
  // replace relative URLs with absolute ones
  cleaned = cleaned.replace(
    withinHtmlTag(/ (src|href)="([^"]*)"/),
    (_match, attrName, url) =>
      attrName === "src" // no extra params needed for images
        ? ` ${attrName}="${url[0] === "/" ? globals.url : ""}${url}"`
        : ` ${attrName}="${addUtmSource(url)}"`
  )
  // for some reason, these global style tags are still making it into the HTML despite my best efforts
  cleaned = cleaned.replace(/<style\s+data-emotion="[^"]*"><\/style>/g, "")
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
    site_url: addUtmSource(globals.url),
    image_url: `${globals.url}/img/logo.png`,
    // managingEditor: globals.email,
    // webMaster: globals.email,
    copyright: `${new Date().getFullYear()} ${globals.yourName}`,
    language: "en",
    pubDate: new Date(posts[0]?.meta.datePublished).toISOString(),
    ttl: 60,
  })

  posts.forEach(({ meta: post, content }) => {
    const Content = content as typeof MDXBlogLayout
    let html = ""
    // sigh... next-page-tester 0.24.1 makes this raise an exception
    // I tried and failed to make a minimum reproducible test case
    if (process.env.NODE_ENV !== "test") {
      html = renderToStaticMarkup(
        <CacheProvider value={NoopEmotionCache}>
          <MyThemeProvider>
            {/* @ts-ignore: don't want to bother typing this correctly */}
            <Content
              processedMeta={{
                ...post,
                forcedTocVisibility: false,
                noForms: true,
              }}
            />
          </MyThemeProvider>
        </CacheProvider>
      )
    }
    html = cleanHtml(html)
    feed.item({
      title: post.title,
      description: post.description,
      custom_elements: [{ "content:encoded": { _cdata: html } }],
      guid: post.slug,
      url: addUtmSource(post.canonicalUrl),
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
