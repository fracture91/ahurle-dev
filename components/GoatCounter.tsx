import React, { useEffect } from "react"
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
      filter(): string | false
      // eslint-disable-next-line camelcase
      bind_events(): void
      // eslint-disable-next-line camelcase
      no_onload: boolean
      // eslint-disable-next-line camelcase
      no_events: boolean
      // provided by me, not GC, because I need a way to disable outside of the no_* props
      disabled: boolean
      // provided by me, not GC, so I can call `count` before the script loads
      queue: (CountVars | undefined)[]
    }
    // provided by me, so I can tell if the GC script loaded by comparing function ref
    gcCountStub: typeof window.goatcounter.count
    gcNoop: typeof window.goatcounter.count
    handleGcScriptLoad(): void
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
      process.env.VERCEL_URL !== "ahurle.dev")
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
// the no_* stuff is because I need to trigger that stuff manually
// In case the script finishes loading after my react stuff, queue up count calls for later.
// Skip analytics for all the staging vercel.app domains
// Also, the prod domain is hardcoded here as a safeguard against someone forking my repo
// and accidentally dumping their data into my account.
// If I'm talking about you: please change `globals.goatCounterId` before altering the host below!
const fallbackJs = `
  window.gcNoop = function(){}
  window.gcCountStub = function(vars){
    if(!this.disabled) this.queue.push(vars)
  }
  window.goatcounter = window.goatcounter || {
    count: window.gcCountStub,
    filter: window.gcNoop,
    bind_events: window.gcNoop,
  }
  window.goatcounter.queue = []
  window.goatcounter.no_onload = true
  window.goatcounter.no_events = true

  if (window.location.host !== 'ahurle.dev') {
    // window.goatcounter.disabled = true
  }
`.replace(/[ \t]+/g, " ")

const FallbackScript: React.FC = () => (
  // eslint-disable-next-line react/no-danger
  <script dangerouslySetInnerHTML={{ __html: fallbackJs }} />
)

// when the script loads successfully, it should overwrite my stub function
const scriptLoaded = (): boolean =>
  ![window.gcCountStub, window.gcNoop].includes(window.goatcounter.count)

// important: can be called twice
if (typeof window !== "undefined")
  window.handleGcScriptLoad = () => {
    // make sure when `disabled == true` I can't call `count` - better than checking disabled manually
    const originalFilter = window.goatcounter.filter
    window.goatcounter.filter = function filter(...args) {
      console.log("wrapped filter called")
      return this.disabled
        ? "disabled with window.goatcounter.disabled"
        : originalFilter.call(this, ...args)
    }

    // if the count stub hasn't been replaced, the loop below might go infinitely?
    if (!scriptLoaded()) return

    // if `count` was called before the script could load, queue will contain events to send
    const { queue } = window.goatcounter
    if (queue.length > 0) console.log("queue not empty")
    while (queue.length > 0) {
      console.log("popping from queue")
      window.goatcounter.count(queue.pop() as CountVars)
    }

    // call bind_events like would usually happen onload
    if (!window.goatcounter.disabled) window.goatcounter.bind_events()
  }

const onRouteChange = () => {
  console.log("onRouteChange")
  if (window.goatcounter.disabled) return
  // If the user has navigated to a different page before the queue could be emptied,
  // we should clear it out so as not to be confusing.  It might look like `[undefined, undefined]`
  // and thus log duplicate pageviews.  Better to just drop the earlier ones.
  window.goatcounter.queue = []
  // goatcounter does not track pushState changes automatically - do it myself
  // count() param is not actually required, but all other calls should have {event: true}
  window.goatcounter.count((undefined as unknown) as CountVars)
  // Goatcounter only adds event listeners on load e.g. for tracking data-goatcounter-click.
  // Re-add them after the page changes, when a bunch of stuff has definitely re-rendered.
  // Goatcounter is smart enough to avoid adding duplicate listeners.
  // Note that if a component using data-goatcounter-click re-renders at a different time,
  // it will need to call this itself since the original DOM node could have been removed.
  window.goatcounter.bind_events()
}

const loadTimeout = 120 * 1000

const RealScript: React.FC = () => {
  const router = useRouter()
  // const { asPath, query } = router

  useEffect(() => {
    const timer = setTimeout(() => {
      // If the script still hasn't finished loading after the timeout, make sure we're not infinitely
      // queueing events (i.e. leaking memory) by replacing our countStub with a no-op.
      if (!scriptLoaded()) {
        window.goatcounter.count = window.gcNoop
        window.goatcounter.queue = []
      }
    }, loadTimeout)
    // If the script finished loading before window.handleGcScriptLoad could be defined,
    // its onLoad will have no effect. In that case call it here, on mount.
    // If it did not finish loading yet, this function is called twice, which it is designed to handle
    window.handleGcScriptLoad()
    // next.js has a problem where routeChangeComplete can be called on first page load
    // https://github.com/vercel/next.js/issues/11639
    // https://github.com/vercel/next.js/discussions/12306
    // detect if this erroneous call is about to happen and skip logging the pageview if so,
    // since it's going to happen later in the routeChangeComplete handler
    // this is why I need to always set goatcounter.no_onload = true - sometimes I need to skip it
    console.log("pageload", router, onRouteChange)
    if (
      !router.asPath.includes("?") ||
      Object.keys(router.query).length !== 0
    ) {
      console.log("init pageview")
      onRouteChange()
    }
    router.events.on("routeChangeComplete", onRouteChange)
    return () => {
      router.events.off("routeChangeComplete", onRouteChange)
      clearTimeout(timer)
    }
    // only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <FallbackScript />
      {/* in case the script finishes loading after the useEffect fires, I need that onload handler */}
      {/* using onLoad in JSX is unreliable since it needs react to hydrate first, hence this awfulness */}
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
        <script
          data-goatcounter=${JSON.stringify(endpoint)}
          ${
            // uncomment for testing out on localhost
            "" + "data-goatcounter-settings='{\"allow_local\": true}'"
          }
          async
          src="https://gc.zgo.at/count.js"
          onload="window.handleGcScriptLoad && window.handleGcScriptLoad()"
        ></script>`.replace(/[ \t]+/g, " "),
        }}
      />
    </>
  )
}

export const GoatCounterScript: React.FC = globals.goatCounterId
  ? RealScript
  : FallbackScript
