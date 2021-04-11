import React from "react"
import * as globals from "@/helpers/globals"
import { Flex, NavLink, Themed, ThemeUICSSObject } from "theme-ui"
import { WrapFC } from "@/helpers/WrapFC"
import { RSS } from "./RSS"

const paddingY: ThemeUICSSObject = { py: ["0.25em", null, "0.5em"] }
const SubtleP: WrapFC<"p"> = (props) => (
  <p {...props} sx={{ ...paddingY, px: "1em", color: "text.subtle" }} />
)

export const Footer: React.FC = () => (
  <Flex
    as="footer"
    sx={{
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
      fontSize: 1,
      flexWrap: "wrap-reverse",
    }}
  >
    <Flex sx={{ flexWrap: "wrap-reverse" }}>
      <SubtleP>{`© ${globals.yourName} ${new Date().getFullYear()}`}</SubtleP>
      <SubtleP>
        Forked from{" "}
        <Themed.a
          href="https://github.com/colinhacks/devii"
          target="_blank"
          rel="noreferrer"
        >
          colinhacks/devii
        </Themed.a>
      </SubtleP>
    </Flex>

    <Flex sx={{ flexWrap: "wrap" }}>
      <NavLink href="https://github.com/fracture91/ahurle-dev" sx={paddingY}>
        GitHub Repo
      </NavLink>

      <NavLink
        href="/rss.xml"
        sx={paddingY}
        data-goatcounter-click="rss-footer"
        target="_blank"
        rel="noopener noreferrer"
      >
        RSS Feed <RSS height="1em" width="1em" />
      </NavLink>
    </Flex>
  </Flex>
)
