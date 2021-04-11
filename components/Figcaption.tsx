import { WrapFC } from "@/helpers/WrapFC"

export const Figcaption: WrapFC<"figcaption"> = (props) => (
  <figcaption
    {...props}
    sx={{
      textAlign: "center",
      fontSize: 1,
      color: "text.subtle",
      marginTop: "0.25em",
    }}
  />
)
