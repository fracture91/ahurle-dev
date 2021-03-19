/** @jsxImportSource theme-ui */
import React from "react"
import * as globals from "@/helpers/globals"
import { Flex, NavLink } from "theme-ui"
import { RSS } from "./RSS"

export const Footer: React.FC = () => (
  <Flex
    as="footer"
    sx={{
      backgroundColor: "background",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
      fontSize: 1,
    }}
  >
    <p sx={{ py: "0.5em", px: "1em", color: "text.subtle" }}>{`© ${
      globals.yourName
    } ${new Date().getFullYear()}`}</p>
    <NavLink href="/rss.xml" sx={{ py: "0.5em" }}>
      RSS Feed <RSS height="1em" width="1em" />
    </NavLink>
  </Flex>
)
