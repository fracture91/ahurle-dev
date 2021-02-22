import glob from "glob"
import Path from "path"
import sizeOf from "image-size"
import * as z from "zod"
import { globals } from "./globals"

const PhotoSchema = z.object({
  url: z.string().nonempty(),
  alt: z.string().nonempty(),
})
export type Photo = z.infer<typeof PhotoSchema>

const RawBannerPhotoSchema = PhotoSchema.extend({
  unsplash: z.string().nonempty().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  thumbnailUrl: z.string().nonempty().optional(),
}).strict()
export type RawBannerPhoto = z.infer<typeof RawBannerPhotoSchema>

const BannerPhotoSchema = RawBannerPhotoSchema.extend({
  // now required
  width: z.number().int().positive(),
  height: z.number().int().positive(),
}).strict()
export type BannerPhoto = z.infer<typeof BannerPhotoSchema>

const AuthorSchema = z
  .object({
    name: z.string().nonempty(),
    photo: z.optional(PhotoSchema),
    twitter: z.optional(z.string().nonempty()),
  })
  .strict()
export type Author = z.infer<typeof AuthorSchema>

// what comes out of the MDX when you import it
const RawBlogMetaSchema = z
  .object({
    title: z.string().nonempty(),
    subtitle: z.string().nonempty().optional(),
    description: z.string().nonempty().optional(),
    canonicalUrl: z.string().nonempty().optional(),
    published: z.boolean().optional(),
    datePublished: z.number().int().positive().optional(),
    author: AuthorSchema.optional(),
    tags: z.string().nonempty().array().optional(),
    bannerPhoto: RawBannerPhotoSchema.optional(),
  })
  .strict()
  .refine((r) => !r.published || r.datePublished, {
    message: "datePublished required when published is true",
    path: ["datePublished"],
  })
  .transform((r) => ({
    ...r,
    published: !!r.published,
    description: r.description || r.subtitle,
    tags: r.tags || [],
    datePublished: r.datePublished || new Date().getTime(),
  }))
  .refine((r) => !r.published || r.bannerPhoto, {
    message: "bannerPhoto required when published is true",
    path: ["bannerPhoto"],
  })
  .refine((r) => !r.published || r.description, {
    message:
      "description is required when published is true, or use subtitle as a fallback",
    path: ["description"],
  })
export type RawBlogMetaOutput = z.output<typeof RawBlogMetaSchema>
export type RawBlogMetaInput = z.input<typeof RawBlogMetaSchema>

// what RawBlogMeta looks like after processing at build-time
export interface BlogMeta<Published extends boolean = boolean> {
  urlPath: string
  slug: string
  title: string
  subtitle?: string
  description: Published extends true ? string : string | undefined
  canonicalUrl: string
  published: Published
  datePublished: number
  author?: Author
  tags: string[]
  bannerPhoto: Published extends true ? BannerPhoto : BannerPhoto | undefined
}

export interface LayoutProps {
  path: string
  meta: RawBlogMetaInput
}

export interface MDXBlogModule extends LayoutProps {
  default(props: any): JSX.Element
}

type ModuleAndPath = { path: BlogPostPath; module: MDXBlogModule }

const MD_EXT = ".mdx"
const BLOG_DIR_FROM_ROOT = "./pages/blog"

export class BlogPostPath {
  private pathFromRoot: string

  private constructor({ pathFromRoot }: { pathFromRoot: string }) {
    this.pathFromRoot = Path.normalize(pathFromRoot)
    if (!this.pathFromRoot.endsWith(MD_EXT)) {
      this.pathFromRoot += MD_EXT
    }
  }

  get pathFromBlogDir(): string {
    return this.pathFromRoot.replace(/^pages\/blog\//, "")
  }

  get urlPath(): string {
    return `blog/${this.slug}`
  }

  get slug(): string {
    const slug = Path.basename(
      this.pathFromRoot,
      Path.extname(this.pathFromRoot)
    )
    if (!slug) throw new Error(`Invalid blog path: ${this.pathFromRoot}`)
    return slug
  }

  equals(other: BlogPostPath) {
    return this.pathFromRoot === other.pathFromRoot
  }

  glob() {
    return glob.sync(this.pathFromRoot).map(BlogPostPath.relativeToRoot)
  }

  static fromSlug(slug: string) {
    return new BlogPostPath({
      pathFromRoot: `${BLOG_DIR_FROM_ROOT}/${slug}`,
    })
  }

  static relativeToRoot(pathFromRoot: string) {
    return new BlogPostPath({ pathFromRoot })
  }

  static relativeToBlogDir(pathFromBlogDir: string) {
    return new BlogPostPath({
      pathFromRoot: `${BLOG_DIR_FROM_ROOT}/${pathFromBlogDir}`,
    })
  }
}

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
