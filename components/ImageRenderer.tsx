/** @jsxImportSource theme-ui */
import React, { ImgHTMLAttributes } from "react"
import { LazyImage } from "./LazyImage"

export const ImageRenderer: React.FC<ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  height,
  ...rest
}) => {
  const layout = height ? "responsive" : "fill"
  return (
    // this wrapping div is necessary when layout == "fill", does no harm for responsive
    <div
      sx={{
        position: "relative",
        height: layout === "fill" ? height || "25rem" : "auto",
      }}
    >
      <LazyImage
        // @ts-ignore
        src={src}
        height={height}
        {...rest}
        layout={layout}
        objectFit="contain"
      />
    </div>
  )
}
