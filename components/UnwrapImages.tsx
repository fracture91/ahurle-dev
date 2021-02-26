/** @jsxImportSource theme-ui */
import React from "react"
import { Themed } from "theme-ui"
import { ImageRenderer } from "./ImageRenderer"

export const UnwrapImages: React.FC<React.ComponentPropsWithoutRef<"p">> = ({
  children,
  ...rest
}) => {
  const hasImage = !!React.Children.toArray(children).find(
    (child) =>
      React.isValidElement(child) &&
      (child.props.mdxType === "img" || child.type === ImageRenderer)
  )
  return hasImage ? <>{children}</> : <Themed.p {...rest}>{children}</Themed.p>
}
