export type MDXComponent = (props: unknown) => JSX.Element

export interface MDXModule {
  default: MDXComponent
}
