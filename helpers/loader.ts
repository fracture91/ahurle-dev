import glob from "glob"
import Path from "path"
import sizeOf from "image-size"
import { globals } from "./globals"

export interface Photo {
  url: string
  alt: string
}

export interface BannerPhoto extends Photo {
  unsplash?: string
  width: number
  height: number
  thumbnailUrl?: string
}

export interface Author {
  name: string
  photo?: Photo
  twitter?: string
}

export interface PostData {
  path: string
  slug: string
  title: string
  subtitle: string | null
  // content: MDXBlogModule["default"]
  description: string | null
  canonicalUrl: string | null
  published: boolean
  datePublished: number | null
  author?: Author
  tags?: string[]
  bannerPhoto?: BannerPhoto
}

interface MDXBlogModule {
  meta: PostData
  default(props: any): JSX.Element
}

type RawFile = { path: MarkdownFilePath; contents: MDXBlogModule }

const MD_EXT = ".mdx"
const BLOG_DIR_FROM_ROOT = "./pages/blog"

export class MarkdownFilePath {
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

  get blogPath(): string {
    return `blog/${this.blogSlug}`
  }

  get blogSlug(): string {
    const slug = Path.basename(
      this.pathFromRoot,
      Path.extname(this.pathFromRoot)
    )
    if (!slug) throw new Error(`Invalid blog path: ${this.pathFromRoot}`)
    return slug
  }

  glob() {
    return glob.sync(this.pathFromRoot).map(MarkdownFilePath.relativeToRoot)
  }

  static fromBlogSlug(slug: string) {
    return new MarkdownFilePath({
      pathFromRoot: `${BLOG_DIR_FROM_ROOT}/${slug}`,
    })
  }

  private static relativeToRoot(pathFromRoot: string) {
    return new MarkdownFilePath({ pathFromRoot })
  }

  static relativeToBlogDir(pathFromBlogDir: string) {
    return new MarkdownFilePath({
      pathFromRoot: `${BLOG_DIR_FROM_ROOT}/${pathFromBlogDir}`,
    })
  }
}

export const loadMarkdownFile = async (
  path: MarkdownFilePath
): Promise<RawFile> => {
  // important: need "../pages/blog/" here explicitly to help out webpack
  const mdFile = await import(`../pages/blog/${path.pathFromBlogDir}`)
  return { path, contents: mdFile }
}

export const mdToPost = async (file: RawFile): Promise<PostData> => {
  const { meta } = file.contents
  const path = file.path.blogPath
  const post: PostData = {
    path,
    slug: file.path.blogSlug,
    title: meta.title,
    subtitle: meta.subtitle || null,
    published: meta.published || false,
    datePublished: meta.datePublished || null,
    tags: meta.tags || [],
    description: meta.description || meta.subtitle || null,
    canonicalUrl: new URL(meta.canonicalUrl || path, globals.url).href,
    author: meta.author,
    bannerPhoto: meta.bannerPhoto,
    // content: file.contents.default,
  }

  // todo: there's gotta be a better way to validate this schema

  if (!post.title) throw new Error("Missing required field: title.")

  // if (!post.content) throw new Error("Missing required field: content.")

  if (!post.datePublished)
    throw new Error("Missing required field: datePublished.")

  if (post.bannerPhoto && !post.bannerPhoto.alt)
    throw new Error("Missing required field: bannerPhoto.alt.")

  if (post.author?.photo && !post.author.photo.alt)
    throw new Error("Missing required field: author.photo.alt.")

  if (
    post.bannerPhoto &&
    (!post.bannerPhoto.width || !post.bannerPhoto.height)
  ) {
    const dimensions = await sizeOf(`public/${post.bannerPhoto.url}`)
    if (!dimensions.width || !dimensions.height) {
      throw new Error(`Could not get image size: ${post.bannerPhoto.url}`)
    }
    post.bannerPhoto.width = dimensions.width
    post.bannerPhoto.height = dimensions.height
  }

  return post as PostData
}

export const loadMarkdownFiles = async (
  paths: MarkdownFilePath[]
): Promise<RawFile[]> =>
  Promise.all(paths.map((path) => loadMarkdownFile(path)))

export const loadPost = async (path: MarkdownFilePath): Promise<PostData> => {
  const file = await loadMarkdownFile(path)
  return mdToPost(file)
}

export const loadBlogPosts = async (): Promise<PostData[]> =>
  (
    await Promise.all(
      (await loadMarkdownFiles(MarkdownFilePath.fromBlogSlug("*").glob())).map(
        mdToPost
      )
    )
  )
    .filter((p) => p.published)
    .sort((a, b) => (b.datePublished || 0) - (a.datePublished || 0))
