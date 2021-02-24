import sizeOf from "image-size"
import type { MDXModule } from "types/mdx.d"
import { globals } from "./globals"
import {
  BlogMeta,
  RawBlogMetaInput,
  RawBlogMetaOutput,
  RawBlogMetaSchema,
  BannerPhoto,
  RawBannerPhoto,
} from "./schema"
import { BlogPostPath } from "./BlogPostPath"

export interface LayoutProps {
  path: string
  excerpt: string
  meta: RawBlogMetaInput
}

export type MDXBlogModule = LayoutProps & MDXModule

type ModuleAndPath = { path: BlogPostPath; module: MDXBlogModule }

export const loadRawBlogPost = async (
  path: BlogPostPath
): Promise<ModuleAndPath> => {
  // important: need "../pages/blog/" here explicitly to help out webpack
  const module = await import(`../pages/blog/${path.pathFromBlogDir}`)
  if (
    typeof module.path !== "string" ||
    !BlogPostPath.relativeToRoot(module.path).equals(path)
  ) {
    throw new Error("Path mismatch - a bug or missing remark plugin?")
  }
  return { path, module }
}

const hasSize = (raw: RawBannerPhoto): raw is BannerPhoto =>
  !!(raw.width && raw.height)

/**
 * Supports three ways to specify the source:
 *
 * ```
 * // using next-images webpack loader
 * import pancake from "public/img/pancake.jpg"
 *
 * src = pancake // "/_next/static/images/pancakes-1234abcd.jpg"
 * src = "img/pancake.jpg" // optional leading slash, below as well
 * src = "public/img/pancake.jpg"
 * ```
 *
 * Converts each case into a file path relative to project root.
 */
export const srcToFsPath = (src: string): string => {
  let done = false
  const result = src.replace(/^\//, "").replace(/^_next\//, () => {
    done = true
    return ".next/"
  })
  if (done) return result

  return result.replace(/^public\/|^/, "public/")
}

export const processRawMeta = async ({
  module,
  path,
}: {
  module: LayoutProps
  path: BlogPostPath
}): Promise<BlogMeta> => {
  try {
    const { urlPath } = path
    const raw: RawBlogMetaOutput = RawBlogMetaSchema.parse(module.meta)

    let bannerPhoto: BannerPhoto | undefined
    if (raw.bannerPhoto) {
      if (hasSize(raw.bannerPhoto)) {
        bannerPhoto = raw.bannerPhoto
      } else {
        const src = srcToFsPath(raw.bannerPhoto.src)
        const { width, height } = await sizeOf(src)
        if (!width || !height) {
          throw new Error(`Could not get image size: ${src}`)
        }
        bannerPhoto = { ...raw.bannerPhoto, width, height }
      }
    }

    return {
      ...raw,
      urlPath,
      description: raw.description || module.excerpt,
      slug: path.slug,
      canonicalUrl: new URL(raw.canonicalUrl || urlPath, globals.url).href,
      bannerPhoto,
    }
  } catch (e) {
    throw new Error(
      `Error parsing meta for blog post ${path.pathFromBlogDir}: ${e.message}`
    )
  }
}

export const loadRawBlogPosts = (
  paths: BlogPostPath[]
): Promise<ModuleAndPath>[] => paths.map((path) => loadRawBlogPost(path))

export const loadBlogMeta = async (path: BlogPostPath): Promise<BlogMeta> => {
  const mp = await loadRawBlogPost(path)
  return processRawMeta(mp)
}

export interface MetaAndContent<Published extends boolean = boolean> {
  meta: BlogMeta<Published>
  content: MDXBlogModule["default"]
}

const isPublished = (meta: BlogMeta): meta is BlogMeta<true> => meta.published
const isMetaAndContentPublished = (
  mc: MetaAndContent
): mc is MetaAndContent<true> => isPublished(mc.meta)

export const loadPublishedBlogs = async (): Promise<MetaAndContent<true>[]> => {
  const paths = BlogPostPath.fromSlug("*").glob()
  const promises = loadRawBlogPosts(paths).map((p) =>
    p.then((mp) =>
      processRawMeta(mp).then((meta) => ({ meta, content: mp.module.default }))
    )
  )
  return (await Promise.all(promises))
    .filter(isMetaAndContentPublished)
    .sort(({ meta: a }, { meta: b }) => b.datePublished - a.datePublished)
}
