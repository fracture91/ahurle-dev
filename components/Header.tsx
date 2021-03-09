/** @jsxImportSource theme-ui */
import React, { useEffect, useRef } from "react"
import Link from "next/link"
import * as globals from "@/helpers/globals"
import { Flex, NavLink } from "theme-ui"
import { WrapFC } from "@/helpers/WrapFC"
import { theme } from "@/helpers/theme"
import { css, Global } from "@emotion/react"
import { ThemeSwitcher } from "./ThemeSwitcher"

const maxHamburgerWidth = "28em"
const hideHamburger = `@media (min-width: ${maxHamburgerWidth})`
const shadow = { boxShadow: "0 2px 6px #0002" }

const Hamburger: WrapFC<"svg"> = React.forwardRef((props, ref) => (
  <svg
    {...{ ...props, ref }}
    viewBox="0 0 120 120"
    sx={{
      [hideHamburger]: {
        display: "none",
      },
      boxSizing: "content-box",
      width: "1.6em",
      height: "1.6em",
      flexBasis: "100%",
      marginX: "auto",
      flexShrink: 0,
      paddingY: "0.5em",
      paddingX: "0.5em",
      cursor: "pointer",
      fill: "currentColor",
      ":hover": {
        bg: "#0001",
      },
    }}
  >
    <rect width="120" height="20" />
    <rect y="40" width="120" height="20" />
    <rect y="80" width="120" height="20" />
  </svg>
))

const Triangle: React.FC = () => (
  <svg
    viewBox="0 0 1 1"
    sx={{
      fill: "currentColor",
      width: "0.8em",
      height: "0.8em",
      transition: "transform 100ms",
      "details[open] &": { transform: "rotate(-90deg)" },
      "*:hover > &": {
        filter: "drop-shadow(0px 0px 2px #0005)",
      },
    }}
  >
    <g>
      <polygon points="0,0.5 1,1 1,0 0,0.5" />
    </g>
  </svg>
)

const Toggle: WrapFC<"div"> = React.forwardRef((props, ref) => (
  <div
    role="button"
    {...{ ...props, ref }}
    sx={{
      display: "none",
      [hideHamburger]: {
        display: "unset",
      },
      "details:not([open]) &": {
        "@media (min-width: 57em)": {
          display: "none",
        },
      },
      ":hover": {
        color: "secondary",
      },
      alignSelf: "center",
      position: "absolute",
      right: 0,
      top: 0,
      paddingY: "0.5em",
      backgroundColor: "background",
      transition: theme.styles.root.transition,
      pr: "1em",
      pl: "3em",
      cursor: "pointer",
      background: (t) =>
        `linear-gradient(to left, ${t.colors?.background} 50%, #ffffff00 100%)`,
    }}
  >
    <Triangle />
  </div>
))

const Summary: WrapFC<"summary"> = React.forwardRef((props, ref) => (
  <summary
    {...{ ...props, ref }}
    sx={{
      display: "flex",
      flexDirection: "column",
      listStyle: "none",
      "&::-webkit-details-marker": { display: "none" },
      outline: "none",
    }}
  />
))

const ExpandoLinks: WrapFC<"details"> = ({ children, ...props }) => {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const hamburgerRef = useRef<SVGSVGElement>(null)
  const toggleRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLElement>(null)

  // The default behavior of the details element is to toggle `open=""` when summary is clicked.
  // We also want it to close when you click anywhere else on the page.
  // Before removing, we must check if any of the default toggling elements were clicked,
  // otherwise their effects cancel each other out.
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      detailsRef.current &&
      hamburgerRef.current &&
      toggleRef.current &&
      summaryRef.current &&
      event.target instanceof Node &&
      !hamburgerRef.current.contains(event.target) &&
      !toggleRef.current.contains(event.target) &&
      event.target !== summaryRef.current
    ) {
      detailsRef.current.removeAttribute("open")
    }
  }
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true)
    return () => {
      document.removeEventListener("click", handleOutsideClick, true)
    }
  })

  return (
    <details
      {...props}
      ref={detailsRef}
      sx={{
        ml: [null, "0.5em", "2em"],
        flex: 1,
        alignSelf: "baseline",
        minWidth: "2em",
        position: "relative",
      }}
    >
      <Summary ref={summaryRef}>
        <Hamburger ref={hamburgerRef} />
        <Flex
          sx={{
            display: "none",
            top: "2.5em",
            [hideHamburger]: {
              display: "flex",
              top: 0,
            },
            flexWrap: "nowrap",
            overflowX: "hidden",
            width: "100%",
            bg: "background",
            transition: theme.styles.root.transition,
            "details[open] &": {
              display: "flex",
              position: "absolute",
              flexWrap: "wrap",
              flexDirection: "column",
              overflowX: "visible",
              minWidth: "8em",
              ...shadow,
              clipPath: "inset(0px -10px -10px -10px)",
            },
          }}
        >
          {children}
          <Toggle ref={toggleRef} />
        </Flex>
      </Summary>
    </details>
  )
}

export const Header: React.FC = () => (
  <header
    sx={{
      backgroundColor: "background",
      color: "primary",
      position: "sticky",
      top: 0,
      zIndex: 100,
      ...shadow,
      transition: theme.styles.root.transition,
    }}
  >
    <Global
      styles={css`
        /* Make sure scrolling to anchors doesn't hide content under header.
         * No webkit support but patch has been merged and not a huge problem.
         */
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          scroll-margin-top: 4em;
        }
      `}
    />
    <Flex
      as="nav"
      sx={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "60em",
        m: "auto",
      }}
    >
      <Link href="/" passHref>
        <NavLink px="0.5em">
          <span sx={{ bg: "gray", borderRadius: "50%", px: "0.2em" }}>A</span>{" "}
          {globals.siteName}
        </NavLink>
      </Link>
      <ExpandoLinks>
        <Link href="/blog" passHref>
          <NavLink>Blog</NavLink>
        </Link>
        <Link href="/recipes" passHref>
          <NavLink>Recipes</NavLink>
        </Link>
        <Link href="/links" passHref>
          <NavLink>Links</NavLink>
        </Link>
        <Link href="/art" passHref>
          <NavLink>Art</NavLink>
        </Link>
        <Link href="/extras" passHref>
          <NavLink>Extras &amp; Ringtones</NavLink>
        </Link>
      </ExpandoLinks>
      <ThemeSwitcher />
    </Flex>
  </header>
)
