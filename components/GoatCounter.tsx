import React, { useCallback, useEffect } from "react"
import * as globals from "@/helpers/globals"
import { useRouter } from "next/router"

type StringOrCallback = string | ((def: string) => string)

// https://ahurle-dev.goatcounter.com/code/js#data-parameters-9
// technically null/undefined are allowed but would probably indicate a bug in my code
interface CountVars {
  path: StringOrCallback
  title?: StringOrCallback
  referrer?: StringOrCallback
  // technically optional, but I'm requiring it here because I should pass event: true 99% of the time
  event: boolean
}

declare global {
  interface Window {
    // incomplete definition
    goatcounter: {
      count(vars: CountVars): void
      // eslint-disable-next-line camelcase
      bind_events(): void
      // eslint-disable-next-line camelcase
      no_onload: boolean
      // eslint-disable-next-line camelcase
      no_events: boolean
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

// always include this JS inline so that I can call these functions without errors
// in the event that the gc script doesn't load, or I want to quickly disable it
const fallbackJs =
  "window.goatcounter = window.goatcounter || { count: function(){}, bind_events: function(){} }"

const RealScript: React.FC = () => {
  const router = useRouter()

  const onRouteChange = useCallback(() => {
    // just in case the goatcounter script blew up
    if (!window.goatcounter) return
    // goatcounter does not track pushState changes automatically - do it myself
    // @ts-ignore: count() param is not actually required, but all other calls should have {event: true}
    if (!window.goatcounter.no_onload) window.goatcounter.count()
    // Goatcounter only adds event listeners on load e.g. for tracking data-goatcounter-click.
    // Re-add them after the page changes, when a bunch of stuff has definitely re-rendered.
    // Goatcounter is smart enough to avoid adding duplicate listeners.
    // Note that if a component using data-goatcounter-click re-renders at a different time,
    // it will need to call this itself since the original DOM node could have been removed.
    if (!window.goatcounter.no_events) window.goatcounter.bind_events()
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
            ${fallbackJs}
            if (window.location.host !== 'ahurle.dev') {
              window.goatcounter.no_onload = true
              window.goatcounter.no_events = true
            }
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

const FallbackScript: React.FC = () => (
  // eslint-disable-next-line react/no-danger
  <script dangerouslySetInnerHTML={{ __html: fallbackJs }} />
)

export const GoatCounterScript: React.FC = globals.goatCounterId
  ? RealScript
  : FallbackScript
