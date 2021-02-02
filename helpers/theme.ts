import {
  Theme as GenericTheme,
  ContextValue as GenericContextValue,
  useThemeUI as genericUseThemeUI,
} from "theme-ui"
import { globals } from "./globals"

const makeTheme = <T extends GenericTheme>(t: T) => t

export const theme = makeTheme({
  useColorSchemeMediaQuery: true, // default to the user's preferred mode
  initialColorModeName: "light",
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
    "1.1875rem",
    "1.25rem",
    "1.5rem",
    "2rem",
    "3rem",
    "4rem",
    "6rem",
  ],
  lineHeights: {
    body: 1.6,
    heading: 1.2,
  },
  sizes: {
    container: "40em",
  },
  text: {
    heading: {
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
    },
  },
  styles: {
    root: {
      backgroundColor: "background",
      color: "text",
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
      fontSize: 2,
    },
    h1: {
      variant: "text.heading",
      fontSize: 6,
      letterSpacing: "-1px",
    },
    h2: {
      variant: "text.heading",
      fontSize: 5,
    },
    h3: {
      variant: "text.heading",
      fontSize: 4,
    },
    h4: {
      variant: "text.heading",
      fontSize: 3,
    },
    h5: {
      variant: "text.heading",
      fontSize: 2,
    },
    h6: {
      variant: "text.heading",
      fontSize: 1,
    },
    p: {
      paddingY: "1em",
      // color: "text",
      // fontFamily: "body",
      // fontWeight: "body",
      // lineHeight: "body",
    },
    a: {
      color: "primary",
    },
    pre: {
      fontFamily: "monospace",
      overflowX: "auto",
      code: {
        color: "inherit",
      },
    },
    code: {
      fontFamily: "monospace",
      fontSize: "inherit",
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
  },
})

// we also want to re-export more narrowly typed things
// https://github.com/system-ui/theme-ui/blob/v0.6.0-alpha.6/packages/docs/src/pages/guides/typescript.mdx#exact-theme-type

export type Theme = typeof theme

interface ContextValue extends Omit<GenericContextValue, "theme"> {
  theme: Theme
}

export const useThemeUI = (genericUseThemeUI as unknown) as () => ContextValue
