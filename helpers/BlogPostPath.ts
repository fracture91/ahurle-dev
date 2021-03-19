/* eslint-disable max-classes-per-file */
// It's a lot easier to read when these two classes are together
import glob from "glob"
import Path from "path"

const MD_EXT = ".mdx"
const PAGES_DIR_FROM_ROOT = "./pages"
const BLOG_DIR_FROM_ROOT = `${PAGES_DIR_FROM_ROOT}/blog`

export class PagePath {
  protected pathFromRoot: string

  public constructor({ pathFromRoot }: { pathFromRoot: string }) {
    this.pathFromRoot = Path.normalize(pathFromRoot)
    if (!this.pathFromRoot.endsWith(MD_EXT)) {
      this.pathFromRoot += MD_EXT
    }
  }

  get pathFromPagesDir(): string {
    return this.pathFromRoot.replace(/^pages\//, "")
  }

  get urlPath(): string {
    return this.pathFromPagesDir.replace(/\..*$/, "")
  }

  get slug(): string {
    const slug = Path.basename(
      this.pathFromRoot,
      Path.extname(this.pathFromRoot)
    )
    if (!slug) throw new Error(`Invalid page path: ${this.pathFromRoot}`)
    return slug
  }

  equals(other: PagePath): boolean {
    return this.pathFromRoot === other.pathFromRoot
  }

  myClass<T extends typeof PagePath>(): T {
    return (this.constructor as unknown) as T
  }

  glob<T extends typeof PagePath>(this: InstanceType<T>): InstanceType<T>[] {
    return glob
      .sync(this.pathFromRoot)
      .map((p) => this.myClass<T>().relativeToRoot<T>(p))
  }

  static relativeToRoot<T extends typeof PagePath>(
    this: T,
    pathFromRoot: string
  ): InstanceType<T> {
    return new this({ pathFromRoot }) as InstanceType<T>
  }

  static relativeToPagesDir<T extends typeof PagePath>(
    this: T,
    pathFromPagesDir: string
  ): InstanceType<T> {
    return new this({
      pathFromRoot: `${PAGES_DIR_FROM_ROOT}/${pathFromPagesDir}`,
    }) as InstanceType<T>
  }
}

export class BlogPostPath extends PagePath {
  get pathFromBlogDir(): string {
    return this.pathFromPagesDir.replace(/^blog\//, "")
  }

  get urlPath(): string {
    return `blog/${this.slug}`
  }

  // I wish I could narrow the types here, but that prevents overriding
  glob<T extends typeof PagePath>(this: InstanceType<T>): InstanceType<T>[] {
    return (
      super.glob
        // typescript gets confused about the type of `this` without `call` :(
        .call<InstanceType<T>, never, InstanceType<T>[]>(this)
        // the point of this override is to exclude the index page - it is not itself a "blog post"
        .filter((p) => !p.equals(BlogPostPath.INDEX_PAGE))
    )
  }

  // even with the above trickery you still need to provide a type parameter
  // to get a BlogPostPath instead of a PagePath, so make usage a little easier... sigh
  globWithoutBlogIndex(): BlogPostPath[] {
    return this.glob<typeof BlogPostPath>()
  }

  static fromSlug(slug: string): BlogPostPath {
    return new BlogPostPath({
      pathFromRoot: `${BLOG_DIR_FROM_ROOT}/${slug}`,
    })
  }

  static relativeToBlogDir(pathFromBlogDir: string): BlogPostPath {
    return new BlogPostPath({
      pathFromRoot: `${BLOG_DIR_FROM_ROOT}/${pathFromBlogDir}`,
    })
  }

  static INDEX_PAGE = BlogPostPath.relativeToBlogDir("index.mdx")
}
