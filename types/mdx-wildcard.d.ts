// originally this was in the same file as the imported types below,
// but exporting types in the same file as a wildcard "declare module" breaks it???
declare module "*.mdx" {
  import { MDXModule } from "@/types/mdx.d"

  export * from "@/types/mdx.d"
  export default MDXModule.default
}
