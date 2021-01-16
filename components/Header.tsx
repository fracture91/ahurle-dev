import React from 'react';
import { globals } from '../globals';
import Link from "next/link";

export const Header: React.FC = () => (
  <div className="header">
    <Link href="/">{globals.siteName}</Link>
    <div className="flex-spacer" />
    <a href="https://github.com/fracture91">GitHub</a>
    <Link href="/blog/the-ultimate-tech-stack">Motivation</Link>
  </div>
);
