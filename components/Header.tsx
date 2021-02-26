/** @jsxImportSource theme-ui */
import React from "react"
import Link from "next/link"
import * as globals from "@/helpers/globals"
import { Flex, NavLink } from "theme-ui"

export const Header: React.FC = () => (
  <header sx={{ backgroundColor: "primary", color: "background" }}>
    <Flex
      as="nav"
      sx={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Link href="/" passHref>
        <NavLink>{globals.siteName}</NavLink>
      </Link>
      <div sx={{ flex: 1 }} />
      <NavLink href="https://github.com/fracture91">GitHub</NavLink>
      <Link href="/blog/the-ultimate-tech-stack" passHref>
        <NavLink>Motivation</NavLink>
      </Link>
    </Flex>
  </header>
)
