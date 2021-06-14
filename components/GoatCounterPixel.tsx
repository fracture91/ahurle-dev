import * as globals from "@/helpers/globals"
import { endpoint } from "@/components/GoatCounterScript"
import type { ParsedUrlQuery } from "querystring"

const RealGoatCounterPixel: React.FC<{
  page: string
  query: ParsedUrlQuery
}> = ({ page, query }) => {
  const params = new URLSearchParams()
  const originalQuery = new URLSearchParams(query as Record<string, string>)
  params.set("p", page)
  params.set("q", originalQuery.toString())
  // normally "r" is used for referrer, but since I can't grab that with SSG I'll use it
  // to help distinguish pixel pageviews from JS ones in case they're botty
  params.set("r", "gcpixel")
  // there are more params available but I'd need SSR for that

  if (
    // Skip analytics for all the staging vercel.app domains and localhost
    // I also want to make assertions against this pixel in test mode
    !["test", "production"].includes(globals.serverEnv()) ||
    // safeguard against people forking my repo and poisoning my data, like in GoatCounterScript
    (globals.goatCounterId === "ahurle-dev" &&
      process.env.VERCEL_GIT_REPO_OWNER !== "fracture91")
  )
    return null

  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${endpoint}?${params.toString()}`} alt="" />
    </noscript>
  )
}

/**
 * Fallback for when JS is turned off - only render on the server!
 */
export const GoatCounterPixel: typeof RealGoatCounterPixel =
  globals.goatCounterId ? RealGoatCounterPixel : () => null
