/* eslint-disable no-underscore-dangle */
import {
  Theme as GenericTheme,
  ThemeUIContextValue as GenericContextValue,
  useThemeUI as genericUseThemeUI,
  useColorMode as genericUseColorMode,
  ThemeUICSSObject,
} from "theme-ui"
import { lighten } from "polished"
import chainLink from "@/public/img/chain-link.svg"
import externalLink from "@/public/img/external-link.svg"
import { preLoadClass } from "@/components/RemovePreLoadClass"

const makeTheme = <T extends GenericTheme>(t: T) => t

const linkInsideHeading: ThemeUICSSObject = {
  "&:hover > a > .icon": {
    visibility: "visible",
  },
}

const emojiFonts = [
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
]

const fonts = (arr: string[]) => arr.concat(emojiFonts).join(", ")
const bodyFonts = fonts([
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  "Oxygen",
  "Ubuntu",
  "Cantarell",
  '"Fira Sans"',
  '"Droid Sans"',
  '"Helvetica Neue"',
  // '"Bitstream Vera Sans"',
  "sans-serif",
])

const darkBackground = "#29241e"

const colors = {
  background: {
    __default: "#fff5e9",
    content: "#fffbf3",
    header: "#fefcf9",
    switchSelected: "var(--theme-ui-colors-background-header)",
    highlightText: "var(--theme-ui-colors-lower)",
  },
  text: {
    __default: "#222",
    subtle: "#555",
    switchSelected: "var(--theme-ui-colors-text)",
  },
  higher: "#fff6",
  lower: "#0001",
  primary: {
    __default: "#3c601e",
    background: {
      __default: "#dce8ac",
      // babel-plugin-polished only works with literals :(
      lighter: lighten(0.02, "#dce8ac"),
    },
  },
  secondary: "#938575",
  imgFilter: "none", // abusing this for non-color CSS vars
  modes: {
    dark: {
      background: {
        __default: darkBackground,
        content: "#191614",
        header: "#3f3831",
        switchSelected: "var(--theme-ui-colors-text)",
        highlightText: "var(--theme-ui-colors-higher)",
      },
      text: {
        __default: "#f0dfca",
        subtle: "#b1a393",
        switchSelected: "var(--theme-ui-colors-background-content)",
      },
      higher: "#fff1",
      lower: "#0006",
      primary: {
        __default: "#90c290",
        background: {
          __default: "#3d603d",
          lighter: lighten(0.04, "#3d603d"),
        },
      },
      imgFilter: "brightness(.9) saturate(80%)",
    },
  },
} as const

export const theme = makeTheme({
  useLocalStorage: false, // persists prefers-color-scheme by default :(
  useColorSchemeMediaQuery: true, // default to the user's preferred mode
  initialColorModeName: "light" as const,
  useRootStyles: true,
  colors,
  breakpoints: ["40rem", "60rem", "120rem", "180rem"],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body: bodyFonts,
    heading: bodyFonts,
    prose: fonts([
      '"Lucida Bright"',
      "Lucidabright",
      "Lucida Serif",
      "Lucida",
      '"DejaVu Serif"',
      '"Bitstream Vera Serif"',
      "Georgia",
      '"Liberation Serif"',
      "serif",
    ]),
    monospace: fonts([
      "SFMono-Regular",
      "Menlo",
      "Consolas",
      "Monaco",
      '"Andale Mono"',
      '"Lucida Console"',
      '"DejaVu Sans Mono"',
      '"Bitstream Vera Sans Mono"',
      '"Liberation Mono"',
      '"Courier New"',
      "monospace",
    ]),
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
  shadows: {
    high: "0 4px 6px #3331, 0 1px 3px #00000007",
    higher: "0 7px 14px #3331, 0 3px 6px #00000007",
  },
  text: {
    heading: {
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      mt: "1.7em",
      mb: "1.2rem",
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
      color: "text",
      backgroundColor: "primary.background",
      borderRadius: 10,
      boxShadow: "high",
      fontSize: 3,
      fontWeight: "bold",
      padding: "1 3",
      cursor: "pointer",
      transition: "background-color 100ms ease, box-shadow 100ms ease",
      "&:hover, &:focus": {
        transform: "translateY(-1px)",
        backgroundColor: "primary.background.lighter",
        boxShadow: "higher",
      },
    },
  },
  links: {
    nav: {
      fontWeight: "body",
      color: "inherit",
      paddingY: "0.5em",
      paddingX: "1em",
      textDecoration: "none",
      flexShrink: 0,
      "&:visited": {
        color: "inherit",
      },
      "&:focus, &:hover": {
        color: "inherit",
        bg: "lower",
      },
    },
  },
  cards: {
    primary: {
      padding: "1em",
      borderRadius: "8px",
      boxShadow: "high",
      transition: "box-shadow 100ms ease",
      "&:hover, &:focus": {
        transform: "translateY(-1px)",
        boxShadow: "higher",
      },
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
      fontSize: ["89.47345%", "100%", null, "110.52645%", "121.0529%"],
      MozOsxFontSmoothing: "grayscale",
      WebkitFontSmoothing: "antialiased",
      wordBreak: "break-word", // because safari doesn't support overflow-wrap: anywhere
      overflowWrap: "anywhere",
      transition: "color 300ms ease, background 300ms ease",
      [`&.${preLoadClass}`]: {
        // without this, Firefox (at least) will flash back to white and transition to black on load :(
        transition: "none",
      },
      img: {
        // want this to apply to all img tags (e.g. next/image), not just Themed.img
        filter: (t) => t.colors?.imgFilter,
        // style the alt text nicely
        backgroundColor: "background.highlightText",
        color: "primary",
      },
    },
    // not standard, special handling by me
    body: {
      fontSize: 3,
    },
    h1: {
      variant: "text.heading",
      mt: "2em",
      fontSize: [6, 7, 8],
      letterSpacing: "-0.03em",
      ...linkInsideHeading,
    },
    h2: {
      variant: "text.heading",
      fontSize: 6,
      paddingBottom: "0.15em",
      borderBottom: "1px solid",
      borderColor: "text.subtle",
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
      maxWidth: "65ch",
      "figcaption &": {
        maxWidth: "none",
      },
      my: "1.5em",
      ":first-child": {
        mt: 0,
      },
      ":last-child": {
        mb: 0,
      },
      "li &": {
        my: "0em",
      },
      "li & + &": {
        mt: "0.2em",
        color: "text.subtle",
        fontSize: 1,
      },
      "h1 + &, h2 + &, h3 + &, h4 + &, h5 + &, h6 + &": {
        mt: 0,
      },
    },
    ul: {
      pl: "1.5em",
    },
    ol: {
      pl: "1.5em",
    },
    li: {
      my: "0.5em",
      "li &": {
        mt: "0.2em",
      },
    },
    a: {
      color: "primary",
      "&:visited": {
        color: "text.subtle",
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
          maskSize: "contain",
          visibility: "hidden",
        },
      },
      '&[target="_blank"]:after': {
        display: "inline-block",
        width: "0.8em",
        height: "0.8em",
        maskImage: `url(${externalLink})`,
        backgroundColor: "currentColor",
        maskSize: "contain",
        content: "' '",
        m: "0 0.2em 0 0.3em",
      },
    },
    pre: {
      fontFamily: "monospace",
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
      bg: darkBackground,
      color: "#d7c8b5",
      " .mdx-marker": {
        // highlighted lines from mdx-prism
        bg: "#fff1",
        mx: "-1em",
        px: "1em",
        boxShadow: `3px 0 0 ${colors.modes.dark.primary.__default} inset`,
      },
    },
    code: {
      fontFamily: "monospace",
      "*:not(pre) > &": {
        fontSize: 2, // one smaller than body, looks too big otherwise
        backgroundColor: "background.highlightText",
        padding: "0.05em 0.2em",
        borderRadius: "0.3em",
      },
      "pre &": {
        // makes .mdx-marker stretch across entire scroll width
        display: "inline-block",
        minWidth: "100%",
      },
    },
    blockquote: {
      borderWidth: 0,
      borderLeftWidth: "1px",
      borderColor: "text.subtle",
      borderStyle: "solid",
      p: "0.5em",
      pl: "1.5em",
      fontStyle: "italic",
      borderRadius: "0 8px 8px 0",
      my: "1em",
      ml: 0,
      mr: "1em",
      color: "text.subtle",
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
      filter: (t) => t.colors?.imgFilter,
    },
    hr: {
      border: "none",
      height: "1px",
      color: "secondary",
      backgroundColor: "secondary",
      marginY: "3em",
    },
  },
})

// based on maxwidth of main page container, plus a nudge towards higher res
export const mainImageSizes: HTMLImageElement["sizes"] = `min(${theme.sizes.container} + 32px, 100vw)`

// https://css-tricks.com/copy-the-browsers-native-focus-styles/
export const browserKbFocusStyles: ThemeUICSSObject = {
  outline: "5px auto Highlight", // moz-specific
  // I really want the same prop twice, hence the leading space
  " outline": "5px auto -webkit-focus-ring-color", // chrome/safari
}

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
