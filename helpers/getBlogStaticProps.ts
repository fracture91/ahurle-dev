import { GetStaticProps } from "next"
import sizeOf from "image-size"
// import glob from "glob"

// @ts-ignore
export const getBlogStaticProps: GetStaticProps<
  { hello: string; bannerPhotoAttrs: object },
  { blog: string }
  // @ts-ignore
> = async ({ params: _params }, meta) => {
  if (!meta.published) {
    return { notFound: true }
  }

  // const allBlogs = glob.sync("pages/mdxblog/*").map(async (p) => {
  //   return import(`../pages/mdxblog/${p.split("pages/mdxblog/")[1]}`)
  // })

  // console.log((await Promise.all(allBlogs)).map((b) => { debugger; return b.meta.author }))

  const dimensions = await sizeOf(`public/${meta.bannerPhoto.url}`)
  if (!dimensions.width || !dimensions.height) {
    throw new Error(`Could not get image size: ${meta.bannerPhoto.url}`)
  }
  return { props: { hello: "world", bannerPhotoAttrs: dimensions } }
}
