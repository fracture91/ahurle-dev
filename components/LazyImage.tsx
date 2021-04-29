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
 *
 * NOTE: as of next.js 10.1.0, a <noscript> fallback has been implemented and this
 * component is superfluous, no more patch necessary.  However, I'm leaving it around
 * in case someone's interested in this fix for earlier next.js versions.  I do wish
 * I could opt-in to native lazy-loading when available and avoid the hacks but it's
 * not worth the trouble.
 *
 * https://github.com/vercel/next.js/releases/tag/v10.1.0
 * https://github.com/vercel/next.js/pull/19052
 *
 * I also noticed that the <noscript> fallback does not specify `loading="lazy"` and
 * thought that might be a problem, but it turns out that both Firefox and Chrome
 * disable lazy image loading whenever JS is disabled, so there's no point patching that.
 */
export const LazyImage: React.FC<ImageProps> = (props) => (
  // loading="eager" tells next/image to disable its built-in lazy loading trickery
  // htmlLoading is a patched-in attr that gets passed to the <img> element as "loading"
  // <Image {...props} loading="eager" htmlLoading="lazy" />
  // eslint-disable-next-line jsx-a11y/alt-text
  <Image {...props} loading="lazy" />
)
