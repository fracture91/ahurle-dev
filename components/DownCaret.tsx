/** @jsxImportSource theme-ui */

import { WrapFC } from "@/helpers/WrapFC"

// me being lazy and not wanting to set up a webpack loader
export const DownCaret: WrapFC<"svg"> = ({ ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" {...props}>
    <path fill="currentColor" d="M0 22v32l64 52 64-52V22L64 74 0 22" />
  </svg>
)
