import type { Author } from "./schema"

const prodUrl = "https://ahurle.dev"
const devUrl = "http://localhost:3000"

export const yourName = "Andrew Hurle"
export const siteName = "ahurle.dev"

// used in meta tags for social shares, google search results, etc.
export const siteDescription = `Portfolio and writings from full-stack software engineer ${yourName}`

export const siteCreationDate = "April 19, 2021 20:00:00 GMT"
export const twitterHandle = "@adhurle"

// used when blog posts don't specify an author
export const defaultBlogAuthor: Author | undefined = {
  name: yourName,
  twitter: twitterHandle,
  photo: {
    src: "/img/me.jpg",
    alt: `Closeup of ${yourName}, smiling`,
  },
}

// if you want to use GoatCounter, sign up for an account and put your ID here
// if you don't want GoatCounter, set to null to disable
export const goatCounterId = "ahurle-dev"

// if you want a newsletter signup form with tinyletter.com, sign up and put your username here
// if not, set to null to disable
export const tinyLetterUsername = "ahurle"

// if you want to use Sentry, sign up for an account and put your key/dsn here
// if you don't want to use Sentry, set either of these to null to disable
export const sentryPublicKey = "aacf3f04ba9b4c3594a77b95e9bad106"
export const sentryDsn = `https://${sentryPublicKey}@o578375.ingest.sentry.io/5734570`

// intentionally left blank in an effort to avoid bots seeing it
// export const email = ""

// if you're deploying somewhere other than Vercel, you'll need to change the following functions
// so that they work on your platform

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

// awkward: calling this function at the top level causes problems in tests
// because window is apparently defined when it should not be
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const serverEnv = () => {
  if (typeof window !== "undefined")
    throw new Error("serverEnv is only accurate on the server")

  return (
    process.env.VERCEL_ENV ||
    (process.env.NODE_ENV === "test" && "test") ||
    "development"
  )
}
