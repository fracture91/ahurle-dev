import glob from "glob"
import Path from "path"

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

  equals(other: BlogPostPath): boolean {
    return this.pathFromRoot === other.pathFromRoot
  }

  glob(): BlogPostPath[] {
    return glob.sync(this.pathFromRoot).map(BlogPostPath.relativeToRoot)
  }

  static fromSlug(slug: string): BlogPostPath {
    return new BlogPostPath({
      pathFromRoot: `${BLOG_DIR_FROM_ROOT}/${slug}`,
    })
  }

  static relativeToRoot(pathFromRoot: string): BlogPostPath {
    return new BlogPostPath({ pathFromRoot })
  }

  static relativeToBlogDir(pathFromBlogDir: string): BlogPostPath {
    return new BlogPostPath({
      pathFromRoot: `${BLOG_DIR_FROM_ROOT}/${pathFromBlogDir}`,
    })
  }
}
