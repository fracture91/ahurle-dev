import { BlogPostPath } from "@/helpers/BlogPostPath"
import * as subject from "@/helpers/loader"
import srcToFsPath from "@/helpers/srcToFsPath"
import * as examplePost from "./examplePost.mdx"

describe("loader", () => {
  describe("srcToFsPath", () => {
    ;[
      // normal cases
      ["/_next/static/images/pancake.jpg", ".next/static/images/pancake.jpg"],
      ["_next/static/images/pancake.jpg", ".next/static/images/pancake.jpg"],
      ["img/pancake.jpg", "public/img/pancake.jpg"],
      ["/img/pancake.jpg", "public/img/pancake.jpg"],
      ["public/img/pancake.jpg", "public/img/pancake.jpg"],
      ["/public/img/pancake.jpg", "public/img/pancake.jpg"],
      // weird cases
      ["publicasdf/whatever", "public/publicasdf/whatever"],
      ["_thing/whatever", "public/_thing/whatever"],
      ["/_nextasdf/whatever", "public/_nextasdf/whatever"],
    ].forEach(([input, expected]) => {
      it(`transforms ${input} to ${expected}`, () => {
        expect(srcToFsPath(input)).toEqual(expected)
      })
    })
  })

  describe("processRawMeta", () => {
    let path: BlogPostPath
    let module: subject.BlogLayoutProps
    beforeEach(() => {
      jest
        .useFakeTimers("modern")
        .setSystemTime(new Date("1970-01-02").getTime())

      path = BlogPostPath.relativeToBlogDir("whatever")
      module = {
        meta: { title: "A Title" },
        path: path.pathFromBlogDir,
        excerpt: "wee",
        // @ts-ignore: unused
        readingTime: {},
        // @ts-ignore: unused
        outline: {},
      }
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it("works for example post", async () => {
      expect(
        await subject.processRawBlogMeta({
          module: examplePost as subject.MDXBlogModule,
          path,
        })
      ).toMatchInlineSnapshot(`
        Object {
          "author": Object {
            "name": "Andrew Hurle",
            "photo": Object {
              "alt": "Closeup of Andrew Hurle, smiling",
              "src": "/img/me.jpg",
            },
            "twitter": "@adhurle",
          },
          "bannerPhoto": undefined,
          "canonicalUrl": "http://localhost:3000/blog/whatever",
          "datePublished": 86400000,
          "description": "Hello world! This is an example blog post. The excerpt should end after this paragraph.",
          "noForms": false,
          "published": false,
          "slug": "whatever",
          "tags": Array [],
          "title": "An Example Post",
          "urlPath": "blog/whatever",
        }
      `)
    })

    it("works for the minimum required meta", async () => {
      await expect(subject.processRawBlogMeta({ module, path })).resolves
        .toMatchInlineSnapshot(`
              Object {
                "author": Object {
                  "name": "Andrew Hurle",
                  "photo": Object {
                    "alt": "Closeup of Andrew Hurle, smiling",
                    "src": "/img/me.jpg",
                  },
                  "twitter": "@adhurle",
                },
                "bannerPhoto": undefined,
                "canonicalUrl": "http://localhost:3000/blog/whatever",
                "datePublished": 86400000,
                "description": "wee",
                "noForms": false,
                "published": false,
                "slug": "whatever",
                "tags": Array [],
                "title": "A Title",
                "urlPath": "blog/whatever",
              }
            `)
    })

    it("allows overriding the default blog author", async () => {
      module.meta.author = {
        name: "Bob",
      }
      await expect(
        subject.processRawBlogMeta({ module, path })
      ).resolves.toHaveProperty("author", { name: "Bob" })
    })

    it("fails when title is missing", async () => {
      module.meta.title = ""
      await expect(
        subject.processRawBlogMeta({ module, path })
      ).rejects.toBeInstanceOf(Error)
    })

    it("fails when published is true due to missing attrs", async () => {
      module.meta.published = true
      await expect(
        subject.processRawBlogMeta({ module, path })
      ).rejects.toBeInstanceOf(Error)
    })

    it("succeeds when published is true and all required attrs present", async () => {
      module.meta = {
        published: true,
        title: "A Title",
        datePublished: 1234,
        bannerPhoto: {
          src: "img/pancakes.jpeg",
          alt: "alt",
        },
      }
      await expect(subject.processRawBlogMeta({ module, path })).resolves
        .toMatchInlineSnapshot(`
              Object {
                "author": Object {
                  "name": "Andrew Hurle",
                  "photo": Object {
                    "alt": "Closeup of Andrew Hurle, smiling",
                    "src": "/img/me.jpg",
                  },
                  "twitter": "@adhurle",
                },
                "bannerPhoto": Object {
                  "alt": "alt",
                  "height": 452,
                  "src": "img/pancakes.jpeg",
                  "width": 900,
                },
                "canonicalUrl": "http://localhost:3000/blog/whatever",
                "datePublished": 1234,
                "description": "wee",
                "noForms": false,
                "published": true,
                "slug": "whatever",
                "tags": Array [],
                "title": "A Title",
                "urlPath": "blog/whatever",
              }
            `)
    })

    it("allows specifying a description in place of the excerpt", async () => {
      module.meta.subtitle = "whatever"
      module.meta.description = "my manual description"
      await expect(
        subject.processRawBlogMeta({ module, path }).then((m) => m.description)
      ).resolves.toEqual(module.meta.description)
    })

    it("falls back to subtitle in place of the excerpt", async () => {
      module.meta.subtitle = "my subtitle"
      await expect(
        subject.processRawBlogMeta({ module, path }).then((m) => m.description)
      ).resolves.toEqual(module.meta.subtitle)
    })

    it("passes through bannerPhoto untouched when sizes are provided", async () => {
      module.meta.bannerPhoto = {
        src: "img/idontexist.jpeg",
        width: 123,
        height: 123,
        alt: "alt",
      }
      await expect(
        subject.processRawBlogMeta({ module, path }).then((m) => m.bannerPhoto)
      ).resolves.toMatchInlineSnapshot(`
              Object {
                "alt": "alt",
                "height": 123,
                "src": "img/idontexist.jpeg",
                "width": 123,
              }
            `)
    })
  })

  describe("mdx remark/rehype/webpack behavior", () => {
    it("Adds excerpt, path exports to mdx files", () => {
      expect(examplePost).toMatchInlineSnapshot(`
        Object {
          "default": [Function],
          "excerpt": "Hello world! This is an example blog post. The excerpt should end after this paragraph.",
          "frontMatter": Object {},
          "meta": Object {
            "title": "An Example Post",
          },
          "outline": Object {
            "children": Array [
              Object {
                "children": Array [
                  Object {
                    "children": Array [
                      Object {
                        "children": Array [
                          Object {
                            "children": Array [
                              Object {
                                "children": Array [],
                                "id": "heading-5",
                                "text": "Heading 5",
                                "type": "heading",
                              },
                              Object {
                                "children": Array [],
                                "id": "heading-6",
                                "text": "Heading 6",
                                "type": "heading",
                              },
                            ],
                            "id": "heading-4",
                            "text": "Heading 4",
                            "type": "heading",
                          },
                        ],
                        "id": "heading-3",
                        "text": "Heading 3",
                        "type": "heading",
                      },
                    ],
                    "id": "heading-2",
                    "text": "Heading 2",
                    "type": "heading",
                  },
                ],
                "id": "heading-1",
                "text": "Heading 1",
                "type": "heading",
              },
            ],
            "type": "root",
          },
          "path": "__tests__/helpers/examplePost.mdx",
          "readingTime": Object {
            "minutes": 0.815,
            "text": "1 min read",
            "time": 48900,
            "words": 163,
          },
        }
      `)
    })

    it("highlights code blocks, adds sizes to images, and otherwise parses things correctly", () => {
      expect(examplePost.default({})).toMatchSnapshot()
    })
  })
})
