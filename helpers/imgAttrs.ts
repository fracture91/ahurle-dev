interface ImgAttrs {
  src: string
  width: number
  height: number
}

const imgAttrs = <T extends ImgAttrs>({ src, width, height }: T): ImgAttrs => ({
  src,
  width,
  height,
})

export default imgAttrs
