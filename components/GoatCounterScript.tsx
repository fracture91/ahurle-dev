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
  }
}

export const endpoint = `https://${globals.goatCounterId}.goatcounter.com/count`

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

// In case the script finishes loading after my react stuff, queue up count calls for later.
const countStub: typeof window.goatcounter.count = function countStub(
  this: typeof window.goatcounter,
  vars
) {
  if (!this.disabled) this.queue.push(vars)
}

export const initWindowGoatcounter = (force?: boolean): void => {
  const gc =
    (!force && window.goatcounter) ||
    ({
      count: countStub,
      filter: noop,
      bind_events: noop,
    } as typeof window.goatcounter)
  window.goatcounter = gc
  gc.queue = []
  // the no_* stuff is because I need to trigger that stuff manually to get around a next.js bug
  gc.no_onload = true
  gc.no_events = true

  // Skip analytics for all the staging vercel.app domains and localhost
  // Also, the prod domain is hardcoded here as a safeguard against someone forking my repo
  // and accidentally dumping their data into my account.
  // If I'm talking about you: please change `globals.goatCounterId` before altering the host below!
  gc.disabled =
    window.location.host !== "ahurle.dev" && process.env.NODE_ENV !== "test"
}

// always run this block in the browser so that I can call these functions without errors
// in the event that the gc script doesn't load, or if I want to quickly disable it
if (typeof window !== "undefined") {
  initWindowGoatcounter()
}

// once we know the state of the script, there's no reason to keep around the UTM params
// clear them in case somebody copy/pastes the URL from their browser
const cleanUtmParams = () => {
  const params = window.location.search.slice(1).split("&")
  // keep in sync with "campaign parameters" setting
  // https://ahurle-dev.goatcounter.com/settings/main
  // fbclid is automatically added to outgoing facebook links
  const newParams = params.filter((p) => !p.match(/^(utm_.*|ref|fbclid)=/))
  if (newParams.length === params.length) return
  const search = newParams.length ? `?${newParams.join("&")}` : ""
  const url = window.location.pathname + search + window.location.hash
  // note that I could use next/router here, but I choose not to to avoid re-renders
  // I think this is safe as long as I never reference these params in my components
  window.history.replaceState(null, "", url)
}

// when the script loads successfully, it should overwrite my stub function
const isScriptLoaded = (): boolean =>
  ![countStub, noop].includes(window.goatcounter.count)

const handleScriptLoad = () => {
  // make sure when `disabled == true` I can't call `count` - better than checking disabled manually
  const originalFilter = window.goatcounter.filter
  window.goatcounter.filter = function filter(...args) {
    return this.disabled
      ? "disabled with window.goatcounter.disabled"
      : originalFilter.call(this, ...args)
  }

  // if the count stub hasn't been replaced, the loop below might go infinitely?
  if (isScriptLoaded()) {
    // if `count` was called before the script could load, queue will contain events to send
    const { queue } = window.goatcounter
    while (queue.length > 0) {
      window.goatcounter.count(queue.shift() as CountVars)
    }
  }

  // call bind_events like would usually happen onload
  if (!window.goatcounter.disabled) window.goatcounter.bind_events()
  cleanUtmParams()
}

const handleScriptError = () => {
  // If the script still hasn't finished loading after the timeout, make sure we're not infinitely
  // queueing events (i.e. leaking memory) by replacing our countStub with a no-op.
  if (!isScriptLoaded()) {
    window.goatcounter.count = noop
    window.goatcounter.queue = []
  }
  cleanUtmParams()
}

const appendScript = () => {
  const script = document.createElement("script")
  script.async = true
  script.src = "https://gc.zgo.at/count.js"
  script.dataset.goatcounter = endpoint
  // uncomment for testing out on localhost - gc will block localhost by default
  // script.dataset.goatcounterSettings = JSON.stringify({ allow_local: true })
  script.addEventListener("load", handleScriptLoad)
  script.addEventListener("error", handleScriptError)
  document.body.appendChild(script)
}

const onRouteChange = () => {
  if (window.goatcounter.disabled) return
  // If the user has navigated to a different page before the queue could be emptied,
  // we should clear it out so as not to be confusing.  It might look like `[undefined, undefined]`
  // and thus log duplicate pageviews.  Better to just drop the earlier ones.
  window.goatcounter.queue = []
  // goatcounter does not track pushState changes automatically - do it myself
  // count() param is not actually required, but all other calls to it should have {event: true}
  window.goatcounter.count((undefined as unknown) as CountVars)
  // Goatcounter only adds event listeners on load e.g. for tracking data-goatcounter-click.
  // Re-add them after the page changes, when a bunch of stuff has definitely re-rendered.
  // Goatcounter is smart enough to avoid adding duplicate listeners.
  // Note that if a component using data-goatcounter-click re-renders at a different time,
  // it will need to call this itself since the original DOM node could have been removed.
  window.goatcounter.bind_events()
}

const loadTimeout = 120 * 1000

const RealGoatCounterScript: React.FC = () => {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(handleScriptError, loadTimeout)

    appendScript()

    // next.js has a problem where routeChangeComplete can be called on first page load
    // https://github.com/vercel/next.js/issues/11639
    // https://github.com/vercel/next.js/discussions/12306
    // detect if this erroneous call is about to happen and skip logging the pageview if so,
    // since it's going to happen later in the routeChangeComplete handler
    // this is why I need to always set goatcounter.no_onload = true - sometimes I need to skip it
    if (
      !router.asPath.includes("?") ||
      Object.keys(router.query).length !== 0
    ) {
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

  return null
}

export const GoatCounterScript: React.FC = globals.goatCounterId
  ? RealGoatCounterScript
  : () => null
