import { WrapFC } from "@/helpers/WrapFC"

// me being lazy and not wanting to set up a webpack loader
export const Logo: WrapFC<"svg"> = ({ ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 139 139" {...props}>
    <path
      fill="currentColor"
      d="M38 5v54L0 134h16l22-43v43h10V80h43v54h11V91l21 43h16l-37-75V5H91v33L75 5H64L48 38V5H38zm32 22l21 43H48l22-43z"
    />
  </svg>
)
