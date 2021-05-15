# ahurle-dev

Powers the
[ahurle.dev](https://ahurle.dev/?utm_source=github)
website and developer blog. Heavily modified fork of
[Devii](https://github.com/colinhacks/devii?utm_source=ahurle-dev).

[I wrote a blog post about this project](https://ahurle.dev/blog/overengineering-a-nextjs-dev-blog?utm_source=github)
if you want some more context on why it exists.

Feel free to fork this repo for your own website! I know how annoying it is to get everything working nicely if you were to start from scratch instead. All I ask is that you style it a little differently - make it "yours". And remove my blog posts and stuff, of course. It would also be nice if you linked back to me, but it's all MIT licensed so... 🤷‍♂️

## Features

- Modern Next.js, React, TypeScript stack
- Author blog posts and other pages in [MDX](https://mdxjs.com/?utm_source=ahurle-dev), export "front matter" as a JS object validated by [`zod`](https://github.com/colinhacks/zod?utm_source=ahurle-dev)
- Syntax highlighting for code blocks in your blog posts
- Dark mode support with [`theme-ui`](https://github.com/system-ui/theme-ui?utm_source=ahurle-dev)
- All pages get automatic smoke tests from [`next-page-tester`](https://github.com/toomuchdesign/next-page-tester/?utm_source=ahurle-dev)
- All pages use [static generation](https://nextjs.org/docs/basic-features/pages?utm_source=ahurle-dev#static-generation-recommended) and the site functions with client-side JS disabled
- Effortless image optimization with [`next/image`](https://nextjs.org/docs/api-reference/next/image?utm_source=ahurle-dev)
- Free analytics from [GoatCounter](https://www.goatcounter.com/?utm_source=ahurle-dev)
- Free hosting from [Vercel](https://vercel.com?utm_source=ahurle-dev)
- Free client-side exception reporting from [Sentry](https://sentry.io?utm_source=ahurle-dev)
- ESLint, Prettier, Jest, and a CI config for [Github Actions](https://github.com/features/actions?utm_source=ahurle-dev) - Free!
- Newsletter signup with [TinyLetter](https://tinyletter.com/?utm_source=ahurle-dev)
- Excerpt, Table of Contents, and Reading Time get extracted from each blog post
- SEO, a11y, RSS, sitemap, page speed are all in pretty good shape

## Getting started

- Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
  and [yarn](https://yarnpkg.com/getting-started/install)
  (perhaps [yvm](https://yvm.js.org/docs/overview) too).
- Clone/fork this repo and `cd` into it

```bash
nvm use  # see .nvmrc
yarn install
yarn dev
```

You should now see my site running on http://localhost:3000

<details>
  <summary>M1 Mac Special Instructions</summary>

I ran this on node 14.x for a while without problems. At some point it started exploding on `yarn install`. I was able to get around it like so:

```bash
nvm install v15.11.0
nvm use v15.*
vim package.json # change engines -> node to "15.x"
```

Note that vercel does not support node 15.x or higher yet. It will probably also work if you use Rosetta for Node 14 rather than trying to compile it natively for arm64.

</details>

<br/>

## CLI

- `yarn dev` - Starts the development server. Equivalent to `next dev`.
- `yarn build` - Creates an optimized, production build of your site. Equivalent to `next build`. Use `yarn start` to run this build locally.
- `ANALYZE=true yarn build` - Also opens webpack-bundle-analyzer output in your browser
- `yarn export` - Exports your site to static files. Equivalent to `next export`.
- `yarn lint` - Run eslint and prettier checks. Use `yarn lint:eslint` or `yarn lint:prettier` for specific checks
- `yarn test` - Run tests

## Creating Your Own Website As a Fork

There are a few basic things you'll want to change right away to make it "your" site:

### [helpers/globals.ts](./helpers/globals.ts)

The constants in this file are pretty self-explanatory. Change the name to match your name, the domain to match yours, etc.

### [next-sitemap.js](./next-sitemap.js)

I got lazy here and duplicated some config from `globals.ts` - change the URL to match your prodUrl, and add any exclusions for e.g. unpublished blog posts.

### GoatCounter

If you want to use GoatCounter for site analytics, [sign up for an account](https://www.goatcounter.com/signup?utm_source=ahurle-dev) and replace `goatCounterId` with your own. If you don't want to use it, you can set `goatCounterId` to null.

[`GoatCounterScript`](./components/GoatCounterScript.tsx) and [`GoatCounterPixel`](./components/GoatCounterPixel.tsx) contain some hardcoded checks to make sure you don't accidentally dump your data into my account in case you haven't read these instructions yet. Changing/Removing these is left as an exercise for the reader.

By default, analytics are only enabled in the prod environment, but you can test in dev by commenting out the prod checks.

### Sentry

You can use Sentry to catch unhandled exceptions on the client side of your app. [Sign up for an account](https://sentry.io/signup/?utm_source=ahurle-dev) and replace `sentryPublicKey` and `sentryDsn` with your own. If you don't want to use it, you can set either constant to null.

Like with `GoatCounterPixel`, there are some hardcoded checks in `SentryLoader` that you might want to remove.

By default, sentry only runs in prod and preview mode, but it can run in dev by commenting out the checks. Try calling `window.onerror("hello world")` to make Sentry log an error.

### TinyLetter

The site contains newsletter signup forms thanks to TinyLetter. [Sign up for an account](https://tinyletter.com/?utm_source=ahurle-dev) and replace `tinyLetterUsername` with your own, or set it to null to disable the forms.

### Snapshots

Once you've changed all this stuff, run `yarn test`. You'll probably have a bunch of failing snapshots that used to contain _my_ globals. Press `u` to update the snapshots to contain _your_ globals. Making sure `yarn lint` still passes is also a good idea.

### Github Actions

This project contains a [CI config](./.github/workflows/ci.yml) that should run whenever you open/update a PR or push to master. It's a good idea to make sure that's passing now. [Here's some documentation to get you started](https://docs.github.com/en/actions/quickstart?utm_source=ahurle-dev).

You may also need to do some separate setup for the specific actions I'm using - especially [bundlewatch](https://github.com/jackyef/bundlewatch-gh-action?utm_source=ahurle-dev) - but I don't remember the specifics 🤷‍♂️

### Vercel

The easiest way to deploy this app is through Vercel. [Sign up for an account](https://vercel.com/signup?utm_source=ahurle-dev) and you can have it deploy your repo with a few clicks. You should be able to visit your site at a `*.vercel.app` domain for now, and later you can point a domain at it like `ahurle.dev`. Remember to change `prodUrl` in `globals.ts` if your domain changes.

If you want to use something else then it's probably not very difficult to switch. Note that I depend on some `VERCEL_*` environment variables, and [`next/image`](https://nextjs.org/docs/basic-features/image-optimization?utm_source=ahurle-dev) requires a server to transform image URLs.

### Assets

- [me.jpg](./public/img/me.jpg): Change this to be an image of you, or delete it if you don't want one
- [favicon.ico](./public/favicon.ico),
  [logo.png](./public/img/logo.png),
  and [logo.svg](./public/img/logo.svg):
  This is the favicon for your site. You'll want to replace these with images of your own creation.
- The rest of the non-SVG files in [/public](./public) can probably be deleted

### Content

Most of the text on the site lives in [/pages](./pages). If you aren't familiar with the concept of pages in Next.js, I recommend [reading the docs](https://nextjs.org/docs/routing/introduction?utm_source=ahurle-dev). You will probably also want to change the [Footer](./components/Footer.tsx) and [Header](./components/Header.tsx).

### Have fun!

The rest is up to you!

<br/>

## License

Most code © 2021 Andrew Hurle, [MIT License](./LICENSE)

Based on [Devii](https://devii.dev/?utm_source=ahurle-dev), © 2020 Colin McDonnell, [MIT License](https://github.com/colinhacks/devii/blob/31ffa9e1399acabd0f79f228dd19336864907165/LICENSE)

[imageSizeLoader.js](./config/imageSizeLoader.js) based on [image-size-loader](https://github.com/boopathi/image-size-loader), © 2015 Patrick Collins and Boopathi Rajaa, [Apache License 2.0](https://github.com/boopathi/image-size-loader/blob/bf1f3bc31c1a9ef579a957a77514ef665681848c/LICENSE)

[mdxDefaultLayout.js](./config/mdxDefaultLayout.js) based on [a file from silvenon.com](https://github.com/silvenon/silvenon.com/blob/3f1bfaad8ad4794cacd7623bff7627ce5e21ceda/etc/remark-mdx-default-layout.js), © 2020 Matija Marohnić <matija.marohnic@gmail.com> (silvenon.com), [MIT License](https://github.com/silvenon/silvenon.com/blob/3f1bfaad8ad4794cacd7623bff7627ce5e21ceda/license)

[mdxImageMetadata.js](./config/mdxImageMetadata.js) based on [a file from kylepfromer.com](https://github.com/kpfromer/portfolio/blob/ba194a9a82c176f7e58f912572d6a0ff8e8bad4c/plugins/image-metadata.ts), © 2019 Kyle Pfromer, [MIT License](https://github.com/kpfromer/portfolio/blob/ba194a9a82c176f7e58f912572d6a0ff8e8bad4c/LICENSE)

[prismStyle.ts](./helpers/prismStyle.ts) based on [the darcula theme from react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/efc3f7b7537d1729193b7a472067bcbe6cbecaf1/src/styles/prism/darcula.js), © 2019 Conor Hastings, [MIT License](https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/efc3f7b7537d1729193b7a472067bcbe6cbecaf1/LICENSE)
