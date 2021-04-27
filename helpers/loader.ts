import sizeOf from "image-size"
import type { MDXModule } from "@/types/mdx.d"
import type * as readingTime from "reading-time"
import type { Parent } from "unist"
import * as globals from "./globals"
import {
  BlogMeta,
  RawBlogMetaInput,
  RawBlogMetaOutput,
  RawBlogMetaSchema,
  BannerPhoto,
  RawBannerPhoto,
  PageMeta,
  RawPageMetaSchema,
  RawPageMetaInput,
} from "./schema"
import { BlogPostPath, PagePath } from "./BlogPostPath"
import srcToFsPath from "./srcToFsPath"

export interface LayoutProps<Meta> {
  path: string
  excerpt: string
  readingTime: ReturnType<typeof readingTime.default>
  outline: Parent
  meta: Meta
}

export type BlogLayoutProps = LayoutProps<RawBlogMetaInput>
export type PageLayoutProps = LayoutProps<RawPageMetaInput>

export type MDXBlogModule = MDXModule<BlogLayoutProps>
export type MDXPageModule = MDXModule<PageLayoutProps>

type ModuleAndPath<P extends PagePath, M extends MDXModule> = {
  path: P
  module: M
}
type BlogModuleAndPath = ModuleAndPath<BlogPostPath, MDXBlogModule>
type PageModuleAndPath = ModuleAndPath<PagePath, MDXPageModule>

export const loadRawPage = async (
  path: PagePath,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  actualModule?: any
): Promise<PageModuleAndPath> => {
  const module =
    // important: need "../pages/" here explicitly to help out webpack
    actualModule || (await import(`../pages/${path.pathFromPagesDir}`))
  if (
    typeof module.path !== "string" ||
    !PagePath.relativeToRoot(module.path).equals(path)
  ) {
    throw new Error("Path mismatch - a bug or missing remark plugin?")
  }
  return { path, module }
}

export const loadRawBlogPost = async (
  path: BlogPostPath
): Promise<BlogModuleAndPath> =>
  loadRawPage(
    path,
    // important: need "../pages/blog/" here explicitly to help out webpack
    await import(`../pages/blog/${path.pathFromBlogDir}`)
  ) as Promise<BlogModuleAndPath>

const hasSize = (raw: RawBannerPhoto): raw is BannerPhoto =>
  !!(raw.width && raw.height)

export const processRawPageMeta = async ({
  module,
  path,
}: {
  module: PageLayoutProps
  path: PagePath
}): Promise<PageMeta> => {
  try {
    const { urlPath } = path
    const raw = RawPageMetaSchema.parse(module.meta)
    return {
      ...raw,
      urlPath,
      description: raw.description || module.excerpt,
      canonicalUrl: new URL(raw.canonicalUrl || path.urlPath, globals.url).href,
    }
  } catch (e) {
    throw new Error(
      `Error parsing meta for page ${path.pathFromPagesDir}: ${e.message}`
    )
  }
}

export const processRawBlogMeta = async ({
  module,
  path,
}: {
  module: BlogLayoutProps
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
      author: raw.author || globals.defaultBlogAuthor,
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
): Promise<BlogModuleAndPath>[] => paths.map((path) => loadRawBlogPost(path))

export const loadBlogMeta = async (path: BlogPostPath): Promise<BlogMeta> => {
  const mp = await loadRawBlogPost(path)
  return processRawBlogMeta(mp)
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
  const paths = BlogPostPath.fromSlug("*").globWithoutBlogIndex()
  const promises = loadRawBlogPosts(paths).map((p) =>
    p.then((mp) =>
      processRawBlogMeta(mp).then((meta) => ({
        meta,
        content: mp.module.default,
      }))
    )
  )
  return (await Promise.all(promises))
    .filter(isMetaAndContentPublished)
    .sort(({ meta: a }, { meta: b }) => b.datePublished - a.datePublished)
}

export const loadRawPages = (paths: PagePath[]): Promise<PageModuleAndPath>[] =>
  paths.map((path) => loadRawPage(path))

export const loadPageMetas = async (): Promise<PageMeta[]> => {
  const blogPaths = BlogPostPath.fromSlug("*")
    .globWithoutBlogIndex()
    .map((p) => p.pathFromPagesDir)
  const paths = PagePath.relativeToPagesDir("**/*")
    .glob()
    // blogs have their own special loading logic - exclude them
    .filter((p) => !blogPaths.includes(p.pathFromPagesDir))
  const promises = loadRawPages(paths).map((p) =>
    p.then((mp) => processRawPageMeta(mp))
  )
  return (await Promise.all(promises)).sort((a, b) =>
    a.urlPath.localeCompare(b.urlPath)
  )
}
