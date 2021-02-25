declare module "rundef" {
  // typescript can't distinguish between a missing prop and present-but-undefined
  // consequently, the return type is still T
  const rundef: <T extends Record<unknown, unknown>>(
    input: T,
    mutate: boolean,
    recursive: boolean | int
  ) => T
  export default rundef
}
