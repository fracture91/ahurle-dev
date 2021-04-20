import React from "react"
import NextHead from "next/head"
import * as globals from "@/helpers/globals"
import { useRouter } from "next/router"

export const Meta: React.FC<{
  meta: {
    title: string
    canonicalUrl?: string
    description?: string
    image?: { src: string; alt: string; width: number; height: number }
  }
}> = ({ meta }) => {
  const router = useRouter()
  const url = new URL(meta.canonicalUrl || router.pathname, globals.url).href
  const image = meta.image?.src && new URL(meta.image.src, globals.url).href
  return (
    <NextHead>
      <title>
        {meta.title} | {globals.siteName}
      </title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" href="/img/logo.svg" type="image/svg+xml" />
      <meta name="copyright" content={globals.yourName} />
      {url && (
        <>
          <link rel="canonical" href={url} />
          <meta property="og:url" content={url} />
        </>
      )}
      <meta property="og:type" content="website" />
      <meta name="twitter:title" property="og:title" content={meta.title} />
      {meta.description && (
        <>
          <meta name="description" content={meta.description} />
          <meta
            name="twitter:description"
            property="og:description"
            content={meta.description}
          />
        </>
      )}
      <meta property="og:site_name" content={globals.siteName} />
      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:site" content={globals.twitterHandle} />
      <meta name="twitter:creator" content={globals.twitterHandle} />
      {meta.image && image && (
        <>
          <meta name="twitter:image" property="og:image" content={image} />
          <meta
            property="og:image:width"
            content={meta.image.width.toString()}
          />
          <meta
            property="og:image:height"
            content={meta.image.height.toString()}
          />
          <meta
            name="twitter:image:alt"
            property="og:image:alt"
            content={meta.image.alt}
          />
        </>
      )}
    </NextHead>
  )
}
