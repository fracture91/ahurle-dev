// types/mdx.d.ts
declare module "*.mdx" {
  const MDXComponent: (props: any) => JSX.Element
  export default MDXComponent
}
