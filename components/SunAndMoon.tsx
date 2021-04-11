import { WrapFC } from "@/helpers/WrapFC"

export const SunAndMoon: WrapFC<"svg", { secondaryColor: string }> = ({
  secondaryColor,
  ...props
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
    <path
      sx={{ fill: secondaryColor || "background" }}
      d="m32 14.4c-15.6 0-23.4 18.9-12.4 29.9 11 11 29.9 3.2 29.9-12.4 0-9.7-7.8-17.5-17.5-17.5z"
    />
    <path
      fill="currentColor"
      d="M32 13A19 19 0 1 0 51 32 19 19 0 0 0 32 13Zm0 33.2A14.2 14.2 0 0 1 19.8 39.4l3 0.4A16.2 16.2 0 0 0 38.6 19.4 14.2 14.2 0 0 1 32 46.2Z"
    />
    <path
      fill="currentColor"
      d="m32 9.8c1.3 0 2.4-1.1 2.4-2.4V3.9c0-3.2-4.7-3.2-4.7 0v3.5c0 1.3 1.1 2.4 2.4 2.4zM9.8 32c0-1.3-1.1-2.4-2.4-2.4H3.9c-3.2 0-3.2 4.7 0 4.7h3.5c1.3 0 2.4-1.1 2.4-2.4zm3.1-15.7c2.2 1.6 5-1.1 3.3-3.3L13.7 10.5c-2.2-1.6-5 1.1-3.3 3.3zM53.5 10.5c-0.9-0.9-2.4-0.9-3.3 0L47.7 13c-2.2 1.6 1.7 5.5 3.3 3.3l2.5-2.5c0.9-0.9 0.9-2.4 0-3.3zM12.9 47.7 10.4 50.2c-2.2 2.3 1.2 5.6 3.4 3.3L16.3 51C18.5 49.4 14.6 45.5 13 47.7Z"
    />
  </svg>
)
