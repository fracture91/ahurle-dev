import React from "react"
import NextHead from "next/head"
import * as globals from "@/helpers/globals"
import { useRouter } from "next/router"

export const Meta: React.FC<{
  meta: {
    title: string
    canonicalUrl?: string
    description?: string
    image?: string
  }
}> = ({ meta }) => {
  const router = useRouter()
  const url = new URL(meta.canonicalUrl || router.pathname, globals.url).href
  const image = meta.image ? new URL(meta.image, globals.url).href : meta.image
  return (
    <NextHead>
      <title>
        {meta.title} | {globals.siteName}
      </title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="copyright" content="Andrew Hurle" />
      {url && <link rel="canonical" href={url} />}
      {meta.description && (
        <meta name="description" content={meta.description} />
      )}
      <meta property="og:type" content="website" />
      <meta name="og:title" property="og:title" content={meta.title} />
      {meta.description && (
        <meta
          name="og:description"
          property="og:description"
          content={meta.description}
        />
      )}
      <meta property="og:site_name" content={globals.siteName} />
      {meta.canonicalUrl && (
        <meta property="og:url" content={meta.canonicalUrl} />
      )}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={meta.title} />
      {meta.description && (
        <meta name="twitter:description" content={meta.description} />
      )}
      {/* <meta name="twitter:site" content={globals.twitterHandle} /> */}
      {/* <meta name="twitter:creator" content={globals.twitterHandle} /> */}
      {image && <meta name="twitter:image" content={image} />}
      {image && <meta property="og:image" content={image} />}
    </NextHead>
  )
}
