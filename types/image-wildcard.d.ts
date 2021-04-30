// represents the additions from imageSizeLoader.js
// keep the list of file extensions in sync with node_modules/next-images/index.d.ts

declare module "*.jpeg" {
  export * from "@/types/ImageFile"
}

declare module "*.jpg" {
  export * from "@/types/ImageFile"
}

declare module "*.png" {
  export * from "@/types/ImageFile"
}

declare module "*.svg" {
  export * from "@/types/ImageFile"
}

declare module "*.gif" {
  export * from "@/types/ImageFile"
}

declare module "*.ico" {
  export * from "@/types/ImageFile"
}

declare module "*.webp" {
  export * from "@/types/ImageFile"
}

declare module "*.jp2" {
  export * from "@/types/ImageFile"
}

declare module "*.avif" {
  export * from "@/types/ImageFile"
}
