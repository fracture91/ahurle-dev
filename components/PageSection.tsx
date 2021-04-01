/** @jsxImportSource theme-ui */
import { Container, Box } from "theme-ui"
import { WrapFC } from "@/helpers/WrapFC"
import { theme } from "@/helpers/theme"
import { ReactNode } from "react"

export const Section: WrapFC<typeof Container> = ({ ...props }) => (
  <Container px={3} my={3} {...props} sx={{ flexShrink: 0 }} />
)

export const Top: WrapFC<typeof Section> = (props) => <Section {...props} />

export const Middle: WrapFC<typeof Section, { sidebar?: ReactNode }> = ({
  sidebar,
  ...props
}) => (
  <Box
    bg="background.content"
    sx={{ transition: theme.styles.root.transition }}
  >
    <div
      sx={{
        width: "100%",
        maxWidth: "60em",
        mx: "auto",
        display: "flex",
        position: "relative",
      }}
    >
      <Section p={3} {...props} />
      {sidebar}
    </div>
  </Box>
)
