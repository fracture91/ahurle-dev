import { Container, Box } from "theme-ui"
import { WrapFC } from "@/helpers/WrapFC"

export const Section: WrapFC<typeof Container> = (props) => (
  <Container as="section" px={3} my={3} {...props} />
)

export const Top: WrapFC<typeof Section> = (props) => <Section {...props} />

export const Middle: WrapFC<typeof Section> = (props) => (
  <Box bg="background.content">
    <Section p={3} {...props} />
  </Box>
)
