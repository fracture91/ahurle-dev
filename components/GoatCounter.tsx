import React, { useCallback, useEffect } from "react"
import * as globals from "@/helpers/globals"
import { useRouter } from "next/router"

declare global {
  interface Window {
    goatcounter: {
      // incomplete definition
      count: (vars?: Record<string, unknown>) => void
      // eslint-disable-next-line camelcase
      no_unload: boolean
    }
  }
}

const endpoint = `https://${globals.goatCounterId}.goatcounter.com/count`

const RealPixel: React.FC = () => {
  const router = useRouter()
  const params = new URLSearchParams()
  const query = new URLSearchParams(router.query as Record<string, string>)
  params.set("p", router.pathname)
  params.set("q", query.toString())
  // normally "r" is used for referrer, but since I can't grab that with SSG I'll use it
  // to help distinguish pixel pageviews from JS ones in case they're botty
  params.set("r", "gcpixel")
  // there are more params available but I'd need SSR for that

  // safeguard against people forking my repo and poisoning my data, like below
  if (
    globals.goatCounterId === "ahurle-dev" &&
    (globals.siteName !== "ahurle.dev" ||
      // Skip analytics for all the staging vercel.app domains
      (process.env.VERCEL_URL && process.env.VERCEL_URL !== "ahurle.dev"))
  )
    return null

  return (
    <noscript>
      <img src={`${endpoint}?${params.toString()}`} alt="" />
    </noscript>
  )
}

/**
 * Fallback for when JS is turned off
 */
export const GoatCounterPixel: React.FC = globals.goatCounterId
  ? RealPixel
  : () => null

const RealScript: React.FC = () => {
  const router = useRouter()

  const onRouteChange = useCallback(() => {
    // just in case the goatcounter script blew up
    if (!window.goatcounter) return
    // honor the prod check
    if (window.goatcounter.no_unload) return
    // goatcounter does not track pushState changes automatically - do it myself
    window.goatcounter.count()
  }, [])

  useEffect(() => {
    router.events.on("routeChangeComplete", onRouteChange)
    return () => {
      router.events.off("routeChangeComplete", onRouteChange)
    }
  }, [router, onRouteChange])

  return (
    <>
      <script
        // Skip analytics for all the staging vercel.app domains
        // Also, the prod domain is hardcoded here as a safeguard against someone forking my repo
        // and accidentally dumping their data into my account.
        // If I'm talking about you: please change `globals.goatCounterId` before altering the host below!
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            if (window.location.host !== 'ahurle.dev')
              window.goatcounter = {no_onload: true}
          `,
        }}
      />
      <script
        data-goatcounter={endpoint}
        // uncomment for testing out on localhost
        // data-goatcounter-settings='{"allow_local": true}'
        async
        src="//gc.zgo.at/count.js"
      />
    </>
  )
}

export const GoatCounterScript: React.FC = globals.goatCounterId
  ? RealScript
  : () => null
