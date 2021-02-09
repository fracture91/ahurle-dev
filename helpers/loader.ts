import matter from "gray-matter"
import glob from "glob"
import Path from "path"
import sizeOf from "image-size"
import { globals } from "./globals"

export type PostData = {
  path: string
  slug: string
  title: string
  subtitle?: string
  content: string
  description?: string
  canonicalUrl?: string
  published: boolean
  datePublished: number
  author?: string
  authorPhoto?: string
  authorPhotoAlt?: string
  authorTwitter?: string
  tags?: string[]
  bannerPhoto?: string
  bannerPhotoAlt?: string
  bannerPhotoUnsplash?: string
  bannerPhotoWidth?: number
  bannerPhotoHeight?: number
  thumbnailPhoto?: string
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
  const post = {
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
    authorPhoto: metadata.data.authorPhoto || null,
    authorPhotoAlt: metadata.data.authorPhotoAlt || null,
    authorTwitter: metadata.data.authorTwitter || null,
    bannerPhoto: metadata.data.bannerPhoto || null,
    bannerPhotoAlt: metadata.data.bannerPhotoAlt || null,
    bannerPhotoUnsplash: metadata.data.bannerPhotoUnsplash || null,
    bannerPhotoWidth: metadata.data.bannerPhotoWidth || null,
    bannerPhotoHeight: metadata.data.bannerPhotoHeight || null,
    thumbnailPhoto: metadata.data.thumbnailPhoto || null,
    content: metadata.content,
  }

  if (!post.title) throw new Error("Missing required field: title.")

  if (!post.content) throw new Error("Missing required field: content.")

  if (!post.datePublished)
    throw new Error("Missing required field: datePublished.")

  if (post.bannerPhoto && !post.bannerPhotoAlt)
    throw new Error("Missing required field: bannerPhotoAlt.")

  if (post.authorPhoto && !post.authorPhotoAlt)
    throw new Error("Missing required field: authorPhotoAlt.")

  if (post.bannerPhoto && (!post.bannerPhotoWidth || !post.bannerPhotoHeight)) {
    const dimensions = await sizeOf(`public/${post.bannerPhoto}`)
    post.bannerPhotoWidth = dimensions.width
    post.bannerPhotoHeight = dimensions.height
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
  (await Promise.all((await loadMarkdownFiles(MarkdownFilePath.fromBlogSlug("*").glob()))
    .map(mdToPost)))
    .filter((p) => p.published)
    .sort((a, b) => (b.datePublished || 0) - (a.datePublished || 0))
