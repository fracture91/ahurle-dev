import {
  Theme as GenericTheme,
  ContextValue as GenericContextValue,
  useThemeUI as genericUseThemeUI,
  useColorMode as genericUseColorMode,
  ThemeUICSSObject,
} from "theme-ui"
import chainLink from "@/public/img/chain-link.svg"
import { preLoadClass } from "@/components/RemovePreLoadClass"
import * as globals from "./globals"

const makeTheme = <T extends GenericTheme>(t: T) => t

const linkInsideHeading: ThemeUICSSObject = {
  "&:hover > a > .icon": {
    visibility: "visible",
  },
}

export const theme = makeTheme({
  useLocalStorage: false, // persists prefers-color-scheme by default :(
  useColorSchemeMediaQuery: true, // default to the user's preferred mode
  initialColorModeName: "light" as const,
  useRootStyles: true,
  colors: {
    background: "#f6f7f6",
    text: "#222",
    primary: globals.accentColor,
    secondary: "#938575",
    tertiary: "#514e4f",
    quaternary: "#31282c",
    modes: {
      dark: {
        background: "#111",
        text: "#f0f1f0",
      },
    },
  },
  breakpoints: ["40rem", "60rem", "120rem", "180rem"],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      '"Helvetica Neue"',
      "sans-serif",
    ].join(", "),
    heading: "inherit",
    monospace: "Menlo, monospace",
  },
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  fontSizes: [
    "0.875rem",
    "1rem",
    "1.125rem",
    "1.1875rem",
    "1.25rem",
    "1.5rem",
    "2rem",
    "2.5rem",
    "3rem",
    "3.5rem",
  ],
  lineHeights: {
    body: 1.6,
    pre: 1.4,
    heading: 1.15,
  },
  sizes: {
    container: "40em",
  },
  text: {
    heading: {
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      marginTop: "1.7em",
      marginBottom: "1rem",
      ":first-child": {
        marginTop: 0,
      },
      ":last-child": {
        marginBottom: 0,
      },
    },
  },
  buttons: {
    primary: {
      backgroundColor: "primary",
      borderRadius: 10,
      border: "none",
      fontSize: 3,
      padding: "1 3",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "secondary",
      },
    },
  },
  links: {
    nav: {
      color: "inherit",
      paddingY: "0.5em",
      paddingX: "1em",
      textDecoration: "none",
      flexShrink: 0,
      "&:visited": {
        color: "inherit",
      },
      "&:hover": {
        color: "secondary",
        bg: "#0001",
      },
    },
  },
  cards: {
    primary: {
      padding: 2,
      borderRadius: 4,
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.125)",
    },
  },
  styles: {
    root: {
      backgroundColor: "background",
      color: "text",
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
      // make everything a little smaller on mobile, larger on big screens
      // i.e. change the size of 1 rem
      fontSize: ["89.4735%", "100%", null, "110%", "130%"],
      MozOsxFontSmoothing: "grayscale",
      WebkitFontSmoothing: "antialiased",
      overflowWrap: "anywhere",
      transition: "color 300ms ease, background 300ms ease",
      [`&.${preLoadClass}`]: {
        // without this, Firefox (at least) will flash back to white and transition to black on load :(
        transition: "none",
      },
    },
    // not standard, special handling by me
    body: {
      fontSize: 3,
    },
    h1: {
      variant: "text.heading",
      fontSize: [6, 7, 8],
      letterSpacing: "-0.03em",
      ...linkInsideHeading,
    },
    h2: {
      variant: "text.heading",
      fontSize: 6,
      paddingBottom: "0.15em",
      borderBottom: "1px solid",
      borderColor: "secondary",
      ...linkInsideHeading,
    },
    h3: {
      variant: "text.heading",
      fontSize: 5,
      ...linkInsideHeading,
    },
    h4: {
      variant: "text.heading",
      fontSize: 4,
      ...linkInsideHeading,
    },
    h5: {
      variant: "text.heading",
      fontSize: 3,
      ...linkInsideHeading,
    },
    h6: {
      variant: "text.heading",
      fontSize: 2,
      ...linkInsideHeading,
    },
    p: {
      marginY: "1.4em",
      ":first-child": {
        marginTop: 0,
      },
      ":last-child": {
        marginBottom: 0,
      },
      "li &": {
        marginY: "1em",
      },
      "h1 + &, h2 + &, h3 + &, h4 + &, h5 + &, h6 + &": {
        marginTop: 0,
      },
    },
    a: {
      color: "primary",
      "&:visited": {
        color: "tertiary",
      },
      "&:hover": {
        color: "secondary",
      },
      "h1 > &, h2 > &, h3 > &, h4 > &, h5 > &, h6 > &": {
        float: "left",
        ml: "-1.9em",
        pr: "0.6em",
        ".icon": {
          display: "inline-block",
          width: "1.3em",
          height: "1.3em",
          mt: "-0.075em",
          // hack: currentColor doesn't work in SVGs via url()
          // mask the backgroundColor instead
          maskImage: `url(${chainLink})`,
          backgroundColor: "currentColor",
          maskImageRepeat: "no-repeat",
          maskImageSize: "contain",
          maskImagePosition: "center",
          visibility: "hidden",
        },
      },
    },
    pre: {
      fontFamily: "monospace",
      "&&": {
        // make sure prism theme styles don't override these
        fontSize: 2,
        lineHeight: "pre",
        overflowX: "auto",
        "li &": {
          marginY: "1em",
        },
        marginY: "1em",
        marginX: -3,
        padding: "0.8em 1em",
        borderRadius: "5px",
      },
      " .mdx-marker": {
        // highlighted lines from mdx-prism
        bg: "#fff1",
        mx: "-1em",
        px: "1em",
        boxShadow: (t) => `3px 0 0 ${t.colors?.primary} inset`,
      },
    },
    code: {
      fontFamily: "monospace",
      fontSize: "inherit",
      backgroundColor: "#00000010",
      padding: "0.05em 0.2em",
      borderRadius: "0.3em",
      "pre &": {
        color: "inherit",
        lineHeight: "inherit",
        backgroundColor: "inherit",
        padding: 0,
        borderRadius: 0,
        display: "inline-block",
        minWidth: "100%",
      },
    },
    blockquote: {
      borderWidth: 0,
      borderLeftWidth: "5px",
      borderColor: "primary",
      borderStyle: "solid",
      padding: "0.5em",
      backgroundColor: "#00000010",
      borderRadius: "0 8px 8px 0",
      marginY: "1em",
      marginX: "0.5rem",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
    },
    th: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    td: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    img: {
      maxWidth: "100%",
    },
    hr: {
      border: "none",
      height: "1px",
      color: "secondary",
      backgroundColor: "secondary",
      marginY: 2,
    },
  },
})

// we also want to re-export more narrowly typed things
// https://github.com/system-ui/theme-ui/blob/v0.6.0-alpha.6/packages/docs/src/pages/guides/typescript.mdx#exact-theme-type

export type Theme = typeof theme

export type ColorMode =
  | keyof typeof theme.colors.modes
  | typeof theme.initialColorModeName

export const colorModes: ColorMode[] = Object.keys(
  theme.colors.modes
) as ColorMode[]
colorModes.unshift(theme.initialColorModeName)

interface ContextValue extends Omit<GenericContextValue, "theme"> {
  theme: Theme
  colorMode: ColorMode
}

export const useThemeUI = (genericUseThemeUI as unknown) as () => ContextValue
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useColorMode = () => genericUseColorMode<ColorMode>()
