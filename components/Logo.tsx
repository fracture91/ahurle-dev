/** @jsxImportSource theme-ui */

import { WrapFC } from "@/helpers/WrapFC"

// me being lazy and not wanting to set up a webpack loader
export const Logo: WrapFC<"svg"> = ({ ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 139 129" {...props}>
    <path
      fill="currentColor"
      d="M38 0v54L0 129h16l22-43v43h10V75h43v54h11V86l21 43h16l-37-75V0H91v32L75 0H64L48 32V0H38zm32 21l21 43H48l22-43z"
    />
  </svg>
)
