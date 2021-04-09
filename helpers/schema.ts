import * as z from "zod"

const PhotoSchema = z.object({
  src: z.string().nonempty(),
  alt: z.string().nonempty(),
})
export type Photo = z.infer<typeof PhotoSchema>

const RawBannerPhotoSchema = PhotoSchema.extend({
  caption: z
    .string()
    .nonempty()
    .optional()
    .or(z.object({ unsplash: z.string().nonempty() })),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
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

const RawPageMetaSchemaNoTransform = z
  .object({
    bare: z.boolean().optional(),
    title: z.string().nonempty(),
    visibleTitle: z.string().nonempty().optional(),
    description: z.string().nonempty().optional(),
    canonicalUrl: z.string().nonempty().optional(),
  })
  .strict()
export const RawPageMetaSchema = RawPageMetaSchemaNoTransform.transform(
  (r) => ({ ...r, bare: !!r.bare })
)
export type RawPageMetaOutput = z.output<typeof RawPageMetaSchema>
export type RawPageMetaInput = z.input<typeof RawPageMetaSchema>

// what RawPageMetaOutput looks like after processing at build-time
export interface PageMeta extends RawPageMetaOutput {
  urlPath: string
}

// what comes out of the MDX when you import it
export const RawBlogMetaSchema = RawPageMetaSchemaNoTransform.omit({
  bare: true,
})
  .extend({
    title: z.string().nonempty(),
    subtitle: z.string().nonempty().optional(),
    description: z.string().nonempty().optional(),
    canonicalUrl: z.string().nonempty().optional(),
    published: z.boolean().optional(),
    datePublished: z.number().int().positive().optional(),
    author: AuthorSchema.optional(),
    tags: z.string().nonempty().array().optional(),
    bannerPhoto: RawBannerPhotoSchema.optional(),
    forcedTocVisibility: z.boolean().optional(),
    noForms: z.boolean().optional(),
  })
  .refine((r) => !r.published || r.datePublished, {
    message: "datePublished required when published is true",
    path: ["datePublished"],
  })
  .transform((r) => ({
    ...r,
    noForms: !!r.noForms,
    published: !!r.published,
    description: r.description || r.subtitle,
    tags: r.tags || [],
    datePublished: r.datePublished || new Date().getTime(),
  }))
  .refine((r) => !r.published || r.bannerPhoto, {
    message: "bannerPhoto required when published is true",
    path: ["bannerPhoto"],
  })
export type RawBlogMetaOutput = z.output<typeof RawBlogMetaSchema>
export type RawBlogMetaInput = z.input<typeof RawBlogMetaSchema>

// what RawBlogMetaOutput looks like after processing at build-time
export interface BlogMeta<Published extends boolean = boolean>
  extends RawBlogMetaOutput {
  // new fields
  urlPath: string
  slug: string
  // same fields but stricter types
  description: Published extends true ? string : string | undefined
  canonicalUrl: string
  published: Published
  bannerPhoto: Published extends true ? BannerPhoto : BannerPhoto | undefined
}
