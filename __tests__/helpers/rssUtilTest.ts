import dedent from "dedent"
import { cleanHtml, generateRSS, rssFilePath } from "@/helpers/rssUtil"
import { MetaAndContent } from "@/helpers/loader"
import MockDate from "mockdate"
import fs from "fs"

describe("rssUtil", () => {
  describe("cleanHtml", () => {
    it("removes style/class tags, makes urls absolute", () => {
      expect(
        cleanHtml(dedent`
        <style data-emotion="-global asdf"></style>
        <style data-emotion="-global asdf"></style>
        <article>
          <div class="hello" aria-role="whatever">
            <p tabIndex="-1" style="color: red">some text</p>
            <a href="https://google.com/whatever">google</a>
            <a href="/somewhere/cool">wee</a>
            <a href="http://localhost:3000/?blah">asdf</a>
            <img src="/somewhere/else"/>
            <img src="https://google.com/favicon.ico"/>
          </div>
        </article>
      `)
      ).toMatchInlineSnapshot(`
        "

        <article>
          <div aria-role=\\"whatever\\">
            <p tabIndex=\\"-1\\">some text</p>
            <a href=\\"https://google.com/whatever\\">google</a>
            <a href=\\"http://localhost:3000/somewhere/cool?utm_source=rss\\">wee</a>
            <a href=\\"http://localhost:3000/?blah=&utm_source=rss\\">asdf</a>
            <img src=\\"http://localhost:3000/somewhere/else\\"/>
            <img src=\\"https://google.com/favicon.ico\\"/>
          </div>
        </article>"
      `)
    })
  })

  describe("generateRSS", () => {
    it("matches snapshot for example data", async () => {
      MockDate.set("2020-01-02")
      const posts: MetaAndContent<true>[] = [
        {
          meta: {
            title: "Cool Blog Post",
            urlPath: "/blog/somewhere",
            slug: "somewhere",
            description: "this article is cool",
            canonicalUrl: "http://localhost:3000/blog/somewhere",
            published: true,
            bannerPhoto: null as never,
            tags: ["a tag"],
            datePublished: new Date("2020-01-01").getTime(),
            noForms: false,
          },
          content: null as never,
        },
      ]
      expect(await generateRSS(posts, true)).toMatchInlineSnapshot(`
        "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?><rss xmlns:dc=\\"http://purl.org/dc/elements/1.1/\\" xmlns:content=\\"http://purl.org/rss/1.0/modules/content/\\" xmlns:atom=\\"http://www.w3.org/2005/Atom\\" version=\\"2.0\\">
          <channel>
            <title><![CDATA[ahurle.dev]]></title>
            <description><![CDATA[Portfolio and writings from full-stack software engineer Andrew Hurle]]></description>
            <link>http://localhost:3000/?utm_source=rss</link>
            <image>
              <url>http://localhost:3000/img/logo.png</url>
              <title>ahurle.dev</title>
              <link>http://localhost:3000/?utm_source=rss</link>
            </image>
            <generator>RSS for Node</generator>
            <lastBuildDate>Thu, 02 Jan 2020 00:00:00 GMT</lastBuildDate>
            <atom:link href=\\"http://localhost:3000/rss.xml\\" rel=\\"self\\" type=\\"application/rss+xml\\"/>
            <pubDate>Wed, 01 Jan 2020 00:00:00 GMT</pubDate>
            <copyright><![CDATA[2020 Andrew Hurle]]></copyright>
            <language><![CDATA[en]]></language>
            <ttl>60</ttl>
            <item>
              <title><![CDATA[Cool Blog Post]]></title>
              <description><![CDATA[this article is cool]]></description>
              <link>http://localhost:3000/blog/somewhere?utm_source=rss</link>
              <guid isPermaLink=\\"false\\">somewhere</guid>
              <category><![CDATA[a tag]]></category>
              <pubDate>Wed, 01 Jan 2020 00:00:00 GMT</pubDate>
              <content:encoded/>
            </item>
          </channel>
        </rss>"
      `)
      expect(fs.existsSync(rssFilePath)).toBeTruthy()
    })
  })
})
