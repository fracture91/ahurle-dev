const prodUrl = "https://ahurle.dev"
const devUrl = "http://localhost:3000"

export const yourName = "Andrew Hurle"
export const siteName = "ahurle.dev"
export const siteDescription = `Portfolio and writings from full-stack software engineer ${yourName}`
export const siteCreationDate = "April 19, 2021 20:00:00 GMT"
export const twitterHandle = "@adhurle"
export const goatCounterId = "ahurle-dev"
export const tinyLetterUsername = "ahurle"
// intentionally left blank in an effort to avoid bots seeing it
// export const email = ""

const getUrl = (): string => {
  // if called client-side, we know what the origin is for sure
  // this could cause mismatches because of the inaccuracy of the below code
  if (typeof window !== "undefined") return window.location.origin

  if (!process.env.VERCEL_ENV) return devUrl

  if (!process.env.VERCEL_URL)
    throw new Error("process.env.VERCEL_URL is undefined!")

  /**
   * https://github.com/vercel/vercel/issues/1054
   * Note that in this case, VERCEL_URL will be something like ahurle-dev-abcd123.vercel.app.
   * This URL will technically work fine, but since users are accessing the site through ahurle.dev
   * it will be strange to see this random other domain, and could cause CORS issues.
   * Hardcode the real prod domain in this case so we don't have to give up SSG and examine the Host
   * header for every request.
   *
   * Tradeoff: if you ever visit ahurle-dev.vercel.app or some other alias, this URL is "wrong".
   * Shouldn't really cause problems since it's only used for SEO meta and RSS stuff right now.
   */
  if (process.env.VERCEL_ENV === "production") return prodUrl

  return `https://${process.env.VERCEL_URL}`
}

/**
 * In certain cases, we must provide absolute URLs instead of relative ones - SEO meta, for example.
 * This provides the best guess for that URL, but can sometimes be wrong.
 */
export const url = getUrl()
