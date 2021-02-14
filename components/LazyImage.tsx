import React from "react"
import Image, { ImageProps } from "next/image"

/**
 * Paired with a patch of next/image, this component will use the browser-native
 * loading="lazy" attr instead of next/image's default backwards-compatible shim.
 * The default behavior doesn't work with JS disabled - the browser shows an empty
 * image that's a placeholder so old browsers don't grab a high-res image right away.
 * This component fixes that, with the downside that images won't be lazily loaded
 * on browsers missing loading="lazy" support (e.g. Safari as of Feb 2021, IE 11).
 * I like this tradeoff.
 *
 * https://caniuse.com/loading-lazy-attr
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading
 * https://nextjs.org/docs/api-reference/next/image#loading
 */
export const LazyImage: React.FC<ImageProps> = (props) => (
  // loading="eager" tells next/image to disable its built-in lazy loading trickery
  // htmlLoading is a patched-in attr that gets passed to the <img> element as "loading"
  <Image {...props} loading="eager" htmlLoading="lazy" />
)
