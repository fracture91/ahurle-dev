import sizeOf from "image-size"
import { globals } from "./globals"
import {
  BlogMeta,
  RawBlogMetaInput,
  RawBlogMetaOutput,
  RawBlogMetaSchema,
  BannerPhoto,
} from "./schema"
import { BlogPostPath } from "./BlogPostPath"

export interface LayoutProps {
  path: string
  meta: RawBlogMetaInput
}

export interface MDXBlogModule extends LayoutProps {
  default(props: any): JSX.Element
}

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
    if (
      raw.bannerPhoto &&
      (!raw.bannerPhoto.width || !raw.bannerPhoto.height)
    ) {
      const { width, height } = await sizeOf(`public/${raw.bannerPhoto.url}`)
      if (!width || !height) {
        throw new Error(`Could not get image size: ${raw.bannerPhoto.url}`)
      }
      bannerPhoto = { ...raw.bannerPhoto, width, height }
    }

    return {
      ...raw,
      urlPath,
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
