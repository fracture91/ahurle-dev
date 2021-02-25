import React, { ElementType } from "react"

export type WrapFC<T extends ElementType> = React.FC<
  React.ComponentPropsWithRef<T>
>
