# ahurle-dev

Powers the ahurle.dev website and developer blog. Heavily modified fork of [Devii](https://github.com/colinhacks/devii).

[I wrote a blog post about this project](https://ahurle.dev/blog/overengineering-a-nextjs-dev-blog) if you want some more context on why it exists.

Feel free to fork this repo for your own website! I know how annoying it is to get everything working nicely if you were to start from scratch instead. All I ask is that you style it a little differently - make it "yours". And remove my blog posts and stuff, of course. It would also be nice if you linked back to me, but it's all MIT licensed so... 🤷‍♂️

## Features

- Modern Next.js, React, TypeScript stack
- Author blog posts and other pages in [MDX](https://mdxjs.com/), export "front matter" as a JS object validated by [`zod`](https://github.com/colinhacks/zod)
- Syntax highlighting for code blocks in your blog posts
- Dark mode support with [`theme-ui`](https://github.com/system-ui/theme-ui)
- All pages get automatic smoke tests from [`next-page-tester`](https://github.com/toomuchdesign/next-page-tester/)
- All pages use [static generation](https://nextjs.org/docs/basic-features/pages#static-generation-recommended) and the site functions with client-side JS disabled
- Effortless image optimization with [`next/image`](https://nextjs.org/docs/api-reference/next/image)
- Free analytics from [GoatCounter](https://www.goatcounter.com/)
- Free hosting from [Vercel](https://vercel.com)
- ESLint, Prettier, Jest, and a CI config for [Github Actions](https://github.com/features/actions) - Free!
- Newsletter signup with [TinyLetter](https://tinyletter.com/)
- Excerpt, Table of Contents, and Reading Time get extracted from each blog post
- SEO, a11y, RSS, page speed are all in pretty good shape

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
