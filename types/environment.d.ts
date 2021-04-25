declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: "development" | "test" | "production"
      VERCEL_ENV?: "production" | "preview" | "development" | ""
      VERCEL_URL?: string
      VERCEL_GIT_COMMIT_SHA?: string
      VERCEL_GIT_REPO_OWNER?: string
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?: string
    }
  }
}

export {}
