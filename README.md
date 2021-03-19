# ahurle-dev

Powers the ahurle.dev website. Heavily modified fork of [Devii](https://github.com/colinhacks/devii).

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
