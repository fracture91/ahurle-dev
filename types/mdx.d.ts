export type MDXComponent = (props: unknown) => JSX.Element

// eslint-disable-next-line @typescript-eslint/ban-types
export interface MDXModule<LayoutProps extends object = unknown>
  extends LayoutProps {
  default: MDXComponent
}
