import matter from "gray-matter"
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
  subtitle?: string
  content: string
  description?: string
  canonicalUrl?: string
  published: boolean
  datePublished: number
  author?: Author
  tags?: string[]
  bannerPhoto?: BannerPhoto
}

type RawFile = { path: MarkdownFilePath; contents: string }

const MD_EXT = ".md"
const MD_DIR_FROM_ROOT = "./md"
const MD_BLOG_DIR_FROM_ROOT = `${MD_DIR_FROM_ROOT}/blog`

export class MarkdownFilePath {
  private pathFromRoot: string

  private constructor({ pathFromRoot }: { pathFromRoot: string }) {
    this.pathFromRoot = Path.normalize(pathFromRoot)
    if (!this.pathFromRoot.endsWith(MD_EXT)) {
      this.pathFromRoot += MD_EXT
    }
  }

  get pathFromMdDir(): string {
    return this.pathFromRoot.replace(/^md\//, "")
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
      pathFromRoot: `${MD_BLOG_DIR_FROM_ROOT}/${slug}`,
    })
  }

  private static relativeToRoot(pathFromRoot: string) {
    return new MarkdownFilePath({ pathFromRoot })
  }

  static relativeToMdDir(pathFromMdDir: string) {
    return new MarkdownFilePath({
      pathFromRoot: `${MD_DIR_FROM_ROOT}/${pathFromMdDir}`,
    })
  }
}

export const loadMarkdownFile = async (
  path: MarkdownFilePath
): Promise<RawFile> => {
  // important: need "../md" here explicitly to help out webpack
  const mdFile = await import(`../md/${path.pathFromMdDir}`)
  return { path, contents: mdFile.default }
}

export const mdToPost = async (file: RawFile): Promise<PostData> => {
  const metadata = matter(file.contents)
  const path = file.path.blogPath
  const post: PostData = {
    path,
    slug: file.path.blogSlug,
    title: metadata.data.title,
    subtitle: metadata.data.subtitle || null,
    published: metadata.data.published || false,
    datePublished: metadata.data.datePublished || null,
    tags: metadata.data.tags || null,
    description: metadata.data.description || metadata.data.subtitle || null,
    canonicalUrl: new URL(metadata.data.canonicalUrl || path, globals.url).href,
    author: metadata.data.author || null,
    bannerPhoto: metadata.data.bannerPhoto || null,
    content: metadata.content,
  }

  // todo: there's gotta be a better way to validate this schema

  if (!post.title) throw new Error("Missing required field: title.")

  if (!post.content) throw new Error("Missing required field: content.")

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
