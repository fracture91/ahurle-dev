import React, { ElementType } from "react"

export type WrapFC<
  T extends ElementType,
  // eslint-disable-next-line @typescript-eslint/ban-types
  U extends Record<string, unknown> = {},
  V extends string | undefined = undefined
> = React.FC<
  (V extends string
    ? Omit<React.ComponentPropsWithRef<T>, V>
    : React.ComponentPropsWithRef<T>) &
    U
>
