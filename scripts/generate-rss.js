import { generateRSS } from "@/helpers/rssUtil"
import { loadPublishedBlogs } from "@/helpers/loader"

loadPublishedBlogs().then((posts) => generateRSS(posts))
