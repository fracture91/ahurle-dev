/** @jsxImportSource theme-ui */
import React from "react"
import * as globals from "@/helpers/globals"
import { Flex, NavLink } from "theme-ui"

export const Footer: React.FC = () => (
  <Flex
    as="footer"
    sx={{
      backgroundColor: "background",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
    }}
  >
    <p sx={{ padding: 3 }}>{`© ${
      globals.yourName
    } ${new Date().getFullYear()}`}</p>
    <NavLink href="/rss.xml">
      <img src="/img/rss-current.svg" alt="RSS Feed" height="30" width="30" />
    </NavLink>
  </Flex>
)
