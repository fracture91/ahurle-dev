import * as globals from "@/helpers/globals"
import fs from "fs"

// unknown in dev mode, don't want to bother shelling out
const COMMIT_SHA =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
  null

const DISABLED_SENTRY_ENVS: ReturnType<typeof globals.serverEnv>[] = [
  "development",
  "test",
]

let keyReplaced = false
let dsnReplaced = false

/**
 * This file is a copy of https://js.sentry-cdn.com/aacf3f04ba9b4c3594a77b95e9bad106.min.js
 * but modified so I can keep the key/dsn in globals.ts like everything else.
 * I'm using the lazy-load technique and hosting it myself for performance reasons:
 *   https://docs.sentry.io/platforms/javascript/install/lazy-load-sentry/
 *
 * Note that the SDK version is contained in this file so you'll need to keep it updated -
 * it's possible that the loader code changes between versions, therefore I'm not replacing it here.
 */
const SENTRY_LOADER_SCRIPT = fs
  .readFileSync("./vendor/sentry-loader.min.js")
  .toString()
  .replace("ahurle-dev-sentry-public-key", () => {
    keyReplaced = true
    return globals.sentryPublicKey
  })
  .replace("ahurle-dev-sentry-dsn", () => {
    dsnReplaced = true
    return globals.sentryDsn
  })

if (!keyReplaced || !dsnReplaced)
  throw new Error("sentry-loader is missing sentinel values")

const RealSentryLoader: React.FC = () => {
  // The runtime: browser thing mimics the sentry next.js SDK.
  const SENTRY_SCRIPT = `${SENTRY_LOADER_SCRIPT}
Sentry.onLoad(function() {
  Sentry.init(${JSON.stringify({
    release: COMMIT_SHA,
    environment: globals.serverEnv(),
    // Setting dsn to an empty string disables reporting - figured this is more realistic
    // in dev mode than removing the scripts entirely.
    // Remove if you want to report exceptions in dev/test.
    ...(DISABLED_SENTRY_ENVS.includes(globals.serverEnv()) ? { dsn: "" } : {}),
  })});
  Sentry.configureScope(function(scope) {
    scope.setTag("runtime", "browser");
  });
});
`

  /**
   * siteName check is to protect against forks forgetting to change the sentry config,
   * since it contains my personal DSN, i.e. API key, which must be public data but I don't
   * want people to dump their errors into my project.
   */
  if (
    globals.siteName !== "ahurle.dev" &&
    globals.sentryPublicKey === "aacf3f04ba9b4c3594a77b95e9bad106"
  )
    return null

  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: SENTRY_SCRIPT }} />
}

export const SentryLoader =
  globals.sentryDsn && globals.sentryPublicKey ? RealSentryLoader : () => null
