import React from "react"
import Link from "next/link"
import { globals } from "../helpers/globals"

export const Header: React.FC = () => (
  <header className="header">
    <Link href="/">{globals.siteName}</Link>
    <div className="flex-spacer" />
    <a href="https://github.com/fracture91">GitHub</a>
    <Link href="/blog/the-ultimate-tech-stack">Motivation</Link>
  </header>
)
