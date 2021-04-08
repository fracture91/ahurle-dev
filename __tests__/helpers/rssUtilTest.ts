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
        <article>
          <div class="hello" aria-role="whatever">
            <p tabIndex="-1" style="color: red">some text</p>
            <a href="/somewhere/cool">wee</a>
            <img src="/somewhere/else"/>
          </div>
        </article>
      `)
      ).toMatchInlineSnapshot(`
        "<article>
          <div aria-role=\\"whatever\\">
            <p tabIndex=\\"-1\\">some text</p>
            <a href=\\"http://localhost:3000/somewhere/cool\\">wee</a>
            <img src=\\"http://localhost:3000/somewhere/else\\"/>
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
          },
          content: null as never,
        },
      ]
      expect(await generateRSS(posts, true)).toMatchInlineSnapshot(`
        "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?><rss xmlns:dc=\\"http://purl.org/dc/elements/1.1/\\" xmlns:content=\\"http://purl.org/rss/1.0/modules/content/\\" xmlns:atom=\\"http://www.w3.org/2005/Atom\\" version=\\"2.0\\">
          <channel>
            <title><![CDATA[ahurle.dev]]></title>
            <description><![CDATA[Dev Blog]]></description>
            <link>http://localhost:3000</link>
            <image>
              <url>http://localhost:3000/img/logo.png</url>
              <title>ahurle.dev</title>
              <link>http://localhost:3000</link>
            </image>
            <generator>RSS for Node</generator>
            <lastBuildDate>Thu, 02 Jan 2020 00:00:00 GMT</lastBuildDate>
            <atom:link href=\\"http://localhost:3000/rss.xml\\" rel=\\"self\\" type=\\"application/rss+xml\\"/>
            <pubDate>Wed, 01 Jan 2020 00:00:00 GMT</pubDate>
            <copyright><![CDATA[2020 Andrew Hurle]]></copyright>
            <language><![CDATA[en]]></language>
            <managingEditor><![CDATA[me@ahurle.dev]]></managingEditor>
            <webMaster><![CDATA[me@ahurle.dev]]></webMaster>
            <ttl>60</ttl>
            <item>
              <title><![CDATA[Cool Blog Post]]></title>
              <description><![CDATA[this article is cool]]></description>
              <link>http://localhost:3000/blog/somewhere</link>
              <guid isPermaLink=\\"true\\">http://localhost:3000/blog/somewhere</guid>
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
