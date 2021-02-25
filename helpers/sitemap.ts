import glob from "glob"
// import { BlogPostPath } from "@/helpers/loader"
import * as globals from "./globals"

export const generateSitemap = async (): Promise<string> => {
  const pagesDir = "./pages/**/*.*"
  const posts = glob.sync(pagesDir)

  const pagePaths = posts
    .filter((path) => !path.includes("["))
    .filter((path) => !path.includes("/_"))
    .map((path) => path.slice(1))

  // const blogPaths = await BlogPostPath.fromSlug("*")
  //   .glob()
  //   .map((p) => p.urlPath)

  const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
      <loc>${globals.url}</loc>
      <lastmod>2020-06-01</lastmod>
  </url>
${[...pagePaths].map((path) => {
  const item = ["<url>"]
  item.push(`  <loc>${globals.url}${path}</loc>`)
  item.push("  <lastmod>2020-06-01</lastmod>")
  return ["<url>"]
})}
</urlset>`

  return sitemap
}
