import glob from "glob"
import Path from "path"
import sizeOf from "image-size"
import { globals } from "./globals"

export interface Photo {
  url: string
  alt: string
}

export interface RawBannerPhoto extends Photo {
  unsplash?: string
  width?: number
  height?: number
  thumbnailUrl?: string
}

export interface BannerPhoto extends RawBannerPhoto {
  // now required
  width: number
  height: number
}

export interface Author {
  name: string
  photo?: Photo
  twitter?: string
}

// what comes out of the MDX when you import it
export interface RawBlogMeta {
  title: string
  subtitle?: string
  description?: string
  canonicalUrl?: string
  published?: boolean
  datePublished?: number
  author?: Author
  tags?: string[]
  bannerPhoto?: RawBannerPhoto
}

// what RawBlogMeta looks like after processing at build-time
export interface BlogMeta<Published extends boolean = boolean> {
  urlPath: string
  slug: string
  title: string
  subtitle?: string
  // content: MDXBlogModule["default"]
  description: string
  canonicalUrl: string
  published: Published
  datePublished: number
  author?: Author
  tags: string[]
  bannerPhoto: Published extends true ? BannerPhoto : BannerPhoto | undefined
}

export interface LayoutProps {
  path: string
  meta: RawBlogMeta
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
  const { meta: raw } = module
  const { urlPath } = path

  const description = raw.description || raw.subtitle
  if (!description) {
    throw new Error("Missing required field: description")
  }

  const published = raw.published || false
  if (published) {
    if (!raw.datePublished) {
      throw new Error("Missing required field: datePublished.")
    }
    if (!raw.bannerPhoto) {
      throw new Error("Missing required field: bannerPhoto.")
    }
  }

  let bannerPhoto: BannerPhoto | undefined
  if (raw.bannerPhoto && (!raw.bannerPhoto.width || !raw.bannerPhoto.height)) {
    const { width, height } = await sizeOf(`public/${raw.bannerPhoto.url}`)
    if (!width || !height) {
      throw new Error(`Could not get image size: ${raw.bannerPhoto.url}`)
    }
    bannerPhoto = { ...raw.bannerPhoto, width, height }
  }

  const processed: BlogMeta<typeof published> = {
    urlPath,
    // fsPath: mp.path.pathFromRoot,
    slug: path.slug,
    title: raw.title,
    subtitle: raw.subtitle,
    published,
    datePublished: raw.datePublished || new Date().getTime(),
    tags: raw.tags || [],
    description,
    canonicalUrl: new URL(raw.canonicalUrl || urlPath, globals.url).href,
    author: raw.author,
    bannerPhoto: bannerPhoto || undefined,
    // content: mp.contents.default,
  }

  // TODO: there's gotta be a better way to validate this schema

  if (!processed.title) throw new Error("Missing required field: title.")

  // if (!post.content) throw new Error("Missing required field: content.")

  if (processed.bannerPhoto && !processed.bannerPhoto.alt)
    throw new Error("Missing required field: bannerPhoto.alt.")

  if (processed.author?.photo && !processed.author.photo.alt)
    throw new Error("Missing required field: author.photo.alt.")

  return processed
}

export const loadRawBlogPosts = (
  paths: BlogPostPath[]
): Promise<ModuleAndPath>[] => paths.map((path) => loadRawBlogPost(path))

export const loadBlogMeta = async (path: BlogPostPath): Promise<BlogMeta> => {
  const mp = await loadRawBlogPost(path)
  return processRawMeta(mp)
}

const isPublished = (meta: BlogMeta): meta is BlogMeta<true> => meta.published

export const loadPublishedBlogMetas = async (): Promise<BlogMeta<true>[]> => {
  const paths = BlogPostPath.fromSlug("*").glob()
  const promises = loadRawBlogPosts(paths).map((p) => p.then(processRawMeta))
  return (await Promise.all(promises))
    .filter(isPublished)
    .sort((a, b) => (b.datePublished || 0) - (a.datePublished || 0))
}
