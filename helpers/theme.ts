import {
  Theme as GenericTheme,
  ThemeUIContextValue as GenericContextValue,
  useThemeUI as genericUseThemeUI,
  useColorMode as genericUseColorMode,
  ThemeUICSSObject,
} from "theme-ui"
import chainLink from "@/public/img/chain-link.svg"
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
    content: "#f7f3f0",
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
  primary: { __default: "#1d521d", background: "#e0fae0" },
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
      primary: { __default: "#90c290", background: "#3d603d" },
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
      "Constantia",
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
  text: {
    heading: {
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      mt: "1.7em",
      mb: "1rem",
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
      border: "none",
      fontSize: 3,
      padding: "1 3",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "lower",
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
      "&:hover": {
        color: "inherit",
        bg: "lower",
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
      my: "1.4em",
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
          maskImageRepeat: "no-repeat",
          maskImageSize: "contain",
          maskImagePosition: "center",
          visibility: "hidden",
        },
      },
      '&[target="_blank"]:after': {
        content:
          "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVR42qXKwQkAIAxDUUdxtO6/RBQkQZvSi8I/pL4BoGw/XPkh4XigPmsUgh0626AjRsgxHTkUThsG2T/sIlzdTsp52kSS1wAAAABJRU5ErkJggg==)",
        m: "0 0.2em 0 0.3em",
      },
    },
    pre: {
      "&&": {
        // make sure prism theme styles don't override these
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
        // match my theme better
        bg: darkBackground,
        color: "#d7c8b5",
        // fix some a11y issues
        ".comment": {
          color: "#9b9b9b",
        },
        ".string, .char": {
          color: "#7ea06a",
        },
      },
      " .mdx-marker": {
        // highlighted lines from mdx-prism
        bg: "#fff1",
        mx: "-1em",
        px: "1em",
        // eslint-disable-next-line no-underscore-dangle
        boxShadow: `3px 0 0 ${colors.modes.dark.primary.__default} inset`,
      },
    },
    code: {
      fontFamily: "monospace",
      fontSize: 2, // one smaller than body, looks too big otherwise
      backgroundColor: "background.highlightText",
      padding: "0.05em 0.2em",
      borderRadius: "0.3em",
      "pre &&&": {
        // make sure prism theme styles don't override these
        fontFamily: "monospace",
        fontSize: "inherit",
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
