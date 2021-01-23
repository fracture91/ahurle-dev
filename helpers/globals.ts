const prodUrl = "https://ahurle.dev"

export namespace globals {
  export const yourName = "Andrew Hurle"
  export const siteName = "ahurle.dev"
  export const siteDescription = "Dev Blog"
  export const siteCreationDate = "January 15, 2021 20:00:00 GMT"
  // export const twitterHandle = '@';
  export const email = "me@ahurle.dev"
  export const url =
    // eslint-disable-next-line no-nested-ternary
    process.env.VERCEL_ENV &&
    process.env.VERCEL_ENV !== "production" &&
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === "production"
      ? prodUrl
      : "http://localhost:3000"
  export const accentColor = "#4fc2b4"
  export const googleAnalyticsId = "" // e.g. 'UA-999999999-1'
}
