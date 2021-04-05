const prodUrl = "https://ahurle.dev"

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
export const goatCounterId = "ahurle-dev"
export const tinyLetterUsername = "ahurle"
