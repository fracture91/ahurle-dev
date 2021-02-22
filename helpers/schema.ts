import * as z from "zod"

const PhotoSchema = z.object({
  url: z.string().nonempty(),
  alt: z.string().nonempty(),
})
export type Photo = z.infer<typeof PhotoSchema>

const RawBannerPhotoSchema = PhotoSchema.extend({
  unsplash: z.string().nonempty().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  thumbnailUrl: z.string().nonempty().optional(),
}).strict()
export type RawBannerPhoto = z.infer<typeof RawBannerPhotoSchema>

const BannerPhotoSchema = RawBannerPhotoSchema.extend({
  // now required
  width: z.number().int().positive(),
  height: z.number().int().positive(),
}).strict()
export type BannerPhoto = z.infer<typeof BannerPhotoSchema>

const AuthorSchema = z
  .object({
    name: z.string().nonempty(),
    photo: z.optional(PhotoSchema),
    twitter: z.optional(z.string().nonempty()),
  })
  .strict()
export type Author = z.infer<typeof AuthorSchema>

// what comes out of the MDX when you import it
export const RawBlogMetaSchema = z
  .object({
    title: z.string().nonempty(),
    subtitle: z.string().nonempty().optional(),
    description: z.string().nonempty().optional(),
    canonicalUrl: z.string().nonempty().optional(),
    published: z.boolean().optional(),
    datePublished: z.number().int().positive().optional(),
    author: AuthorSchema.optional(),
    tags: z.string().nonempty().array().optional(),
    bannerPhoto: RawBannerPhotoSchema.optional(),
  })
  .strict()
  .refine((r) => !r.published || r.datePublished, {
    message: "datePublished required when published is true",
    path: ["datePublished"],
  })
  .transform((r) => ({
    ...r,
    published: !!r.published,
    description: r.description || r.subtitle,
    tags: r.tags || [],
    datePublished: r.datePublished || new Date().getTime(),
  }))
  .refine((r) => !r.published || r.bannerPhoto, {
    message: "bannerPhoto required when published is true",
    path: ["bannerPhoto"],
  })
  .refine((r) => !r.published || r.description, {
    message:
      "description is required when published is true, or use subtitle as a fallback",
    path: ["description"],
  })
export type RawBlogMetaOutput = z.output<typeof RawBlogMetaSchema>
export type RawBlogMetaInput = z.input<typeof RawBlogMetaSchema>

// what RawBlogMeta looks like after processing at build-time
export interface BlogMeta<Published extends boolean = boolean> {
  urlPath: string
  slug: string
  title: string
  subtitle?: string
  description: Published extends true ? string : string | undefined
  canonicalUrl: string
  published: Published
  datePublished: number
  author?: Author
  tags: string[]
  bannerPhoto: Published extends true ? BannerPhoto : BannerPhoto | undefined
}
