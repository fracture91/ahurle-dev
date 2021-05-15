// this is janky because it doesn't use any of the config from globals.ts :/

module.exports = {
  siteUrl: "https://ahurle.dev",
  generateRobotsTxt: true,
  // ugh... I can't execute TS code from here to get the unpublished blog posts
  // similar to the problems in generateRSS/getIndexStaticProps
  exclude: ["/blog/the-ultimate-tech-stack"],
}
