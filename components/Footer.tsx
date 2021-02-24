/** @jsxImportSource theme-ui */
import React from "react"
import { globals } from "@/helpers/globals"
import { Flex, NavLink } from "theme-ui"

export const Footer: React.FC = () => (
  <Flex
    as="footer"
    sx={{
      backgroundColor: "primary",
      color: "background",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <p sx={{ padding: 3 }}>{`© ${
      globals.yourName
    } ${new Date().getFullYear()}`}</p>
    <NavLink href="/rss.xml">
      <img src="/img/rss-white.svg" alt="RSS Feed" height="30" width="30" />
    </NavLink>
  </Flex>
)
