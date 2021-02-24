export type MDXComponent = (props: any) => JSX.Element

export interface MDXModule {
  default: MDXComponent
}
