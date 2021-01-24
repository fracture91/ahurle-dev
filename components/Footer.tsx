import React from "react"
import { globals } from "helpers/globals"

export const Footer: React.FC = () => (
  <footer className="footer">
    <p>{`© ${globals.yourName} ${new Date().getFullYear()}`}</p>
    <a href="/rss.xml">
      <img src="/img/rss-white.svg" alt="RSS Feed" height="30" width="30" />
    </a>
  </footer>
)
