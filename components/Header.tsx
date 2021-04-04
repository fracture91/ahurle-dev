/** @jsxImportSource theme-ui */
import React, { useEffect, useRef, useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import throttle from "lodash/throttle"
import * as globals from "@/helpers/globals"
import { Flex, NavLink } from "theme-ui"
import { WrapFC } from "@/helpers/WrapFC"
import { theme, Theme } from "@/helpers/theme"
import { css, Global } from "@emotion/react"
import { Logo } from "./Logo"
import { ThemeSwitcher } from "./ThemeSwitcher"
import { DownCaret } from "./DownCaret"

const maxHamburgerWidth = "28em"
const hideHamburger = `@media (min-width: ${maxHamburgerWidth})`
const border = {
  border: "1px solid #0001",
  borderWidth: 0,
  borderBottomWidth: "1px",
}

const Hamburger: WrapFC<"svg"> = React.forwardRef((props, ref) => (
  <svg
    {...{ ...props, ref }}
    viewBox="0 0 100 100"
    sx={{
      [hideHamburger]: {
        display: "none",
      },
      display: "block",
      boxSizing: "content-box",
      width: "1.6em",
      height: "1.6em",
      flexBasis: "100%",
      mx: "auto",
      flexShrink: 0,
      pt: "0.6em",
      pb: "0.4em",
      px: "0.5em",
      cursor: "pointer",
      fill: "currentColor",
      ":hover": {
        bg: "lower",
      },
    }}
  >
    <rect width="100" height="13" rx="10" />
    <rect y="35" width="100" height="13" rx="10" />
    <rect y="70" width="100" height="13" rx="10" />
  </svg>
))

const StyledDownCaret: React.FC = () => (
  <div
    sx={{
      px: "1em",
      py: "0.5em",
      bg: "background.header",
      transition: theme.styles.root.transition,
      "*:hover > &": { bg: "lower" },
    }}
  >
    <DownCaret
      sx={{
        width: "1.1em",
        height: "1.1em",
        position: "relative",
        top: "0.2em",
        transition: "transform 100ms",
        "details[open] &": { transform: "rotate(180deg)" },
        "*:hover > &, *:hover > * > &": {
          transform: "translateY(-1px)",
        },
      }}
    />
  </div>
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
        "@media (min-width: 51em)": {
          display: "none",
        },
      },
      alignSelf: "center",
      position: "absolute",
      right: 0,
      top: 0,
      bg: "background.header",
      pl: "1em",
      cursor: "pointer",
      background: (t) =>
        `linear-gradient(to left, ${
          (t as Theme).colors.background.header
        } 75%, #ffffff00 100%)`,
    }}
  >
    <StyledDownCaret />
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

const ExpandoLinks: WrapFC<"details"> = React.forwardRef(
  ({ children, ...props }, ref) => {
    const localRef = useRef<HTMLDetailsElement>(null)
    const detailsRef = (ref as React.RefObject<HTMLDetailsElement>) || localRef
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
          mr: "0.1em",
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
              bg: "background.header",
              transition: theme.styles.root.transition,
              "details[open] &": {
                display: "flex",
                position: "absolute",
                flexWrap: "wrap",
                flexDirection: "column",
                overflowX: "visible",
                minWidth: "8em",
                ...border,
                borderLeftWidth: "1px",
                borderRightWidth: "1px",
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
)

const scrollTop = () => {
  if (typeof window === "undefined") return 0
  const top = window.pageYOffset || document.documentElement.scrollTop
  return top >= 0 ? top : 0
}

const throttleMs = 200
const necessaryPxPerMs = 0.1
const necessaryPxPerThrottle = throttleMs * necessaryPxPerMs
const keepVisibleAbovePx = 100

export const Header: React.FC = () => {
  const router = useRouter()
  const [visible, setVisible] = useState(true)
  const expandoRef = useRef<HTMLElement>(null)
  const lastScrollTop = useRef(scrollTop())
  const onScroll = useMemo<EventListener>(
    () =>
      throttle((_event) => {
        const currentScrollTop = scrollTop()
        const difference = currentScrollTop - lastScrollTop.current
        if (
          difference < -necessaryPxPerThrottle ||
          currentScrollTop < keepVisibleAbovePx
        ) {
          setVisible(true)
        } else if (
          difference > necessaryPxPerThrottle &&
          !expandoRef.current?.hasAttribute("open")
        ) {
          setVisible(false)
        }
        lastScrollTop.current = currentScrollTop
      }, throttleMs),
    []
  )

  // for some reason the onScroll event doesn't get triggered in this case,
  // even though I think it ought to be triggered because it's calling window.scrollTo
  useEffect(() => {
    router.events.on("routeChangeComplete", onScroll)
    return () => {
      router.events.off("routeChangeComplete", onScroll)
    }
  }, [router, onScroll])

  useEffect(() => {
    window.addEventListener("scroll", onScroll, true)
    return () => {
      window.removeEventListener("scroll", onScroll, true)
    }
  }, [onScroll])

  return (
    <header
      sx={{
        bg: "background.header",
        color: "text",
        position: "sticky",
        top: 0,
        zIndex: 100,
        ...border,
        transition: [
          theme.styles.root.transition,
          "transform 200ms linear",
        ].join(","),
        flexShrink: 0,
        transform: visible ? "translateY(0)" : "translateY(-120%)",
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
          <NavLink px="0.5em" sx={{ display: "flex", alignItems: "center" }}>
            <Logo
              sx={{
                width: "1.6em",
                height: "1.6em",
                bg: "primary.background",
                borderRadius: "50%",
                px: "0.2em",
                mr: "0.4em",
                color: "primary",
                transition: theme.styles.root.transition,
                "@keyframes wiggle": {
                  "25%": { transform: "rotate(-10deg)" },
                  "50%": { transform: "rotate(0deg)" },
                  "75%": { transform: "rotate(10deg)" },
                },
                "&:hover, a:hover &": {
                  animation: "150ms ease-in-out 0s 2 wiggle",
                },
              }}
            />
            {globals.siteName}
          </NavLink>
        </Link>
        <ExpandoLinks ref={expandoRef}>
          <Link href="/blog" passHref>
            <NavLink>Blog</NavLink>
          </Link>
          <Link href="/links" passHref>
            <NavLink>Links</NavLink>
          </Link>
          <Link href="/recipes" passHref>
            <NavLink>Recipes</NavLink>
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
}
