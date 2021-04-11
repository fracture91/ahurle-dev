import { Container, Box } from "theme-ui"
import { WrapFC } from "@/helpers/WrapFC"
import { theme } from "@/helpers/theme"
import { ReactNode } from "react"

export const Section: WrapFC<typeof Container> = ({ ...props }) => (
  <Container px={3} my={3} {...props} sx={{ flexShrink: 0 }} />
)

export const Top: WrapFC<typeof Section> = (props) => <Section {...props} />

export const Middle: WrapFC<typeof Box, { sidebar?: ReactNode }> = ({
  sidebar,
  children,
  ...props
}) => (
  <Box
    bg="background.content"
    mb="3em"
    pb="1em"
    sx={{ transition: theme.styles.root.transition }}
    {...props}
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
      <Section p={3}>{children}</Section>
      {sidebar}
    </div>
  </Box>
)
