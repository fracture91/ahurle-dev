import React, { ElementType } from "react"

export type WrapFC<T extends ElementType<any>> = React.FC<
  React.ComponentPropsWithRef<T>
>
