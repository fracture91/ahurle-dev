import { WrapFC } from "@/helpers/WrapFC"

export const RSS: WrapFC<"svg"> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" {...props}>
    <path
      fill="currentColor"
      d="M85 469a85 85 0 100 170 85 85 0 100-170zM0 217v123a298 298 0 01299 300h123c0-233-189-423-422-423zM0 0v123c285 0 517 232 517 517h123C640 287 353 0 0 0z"
    />
  </svg>
)
