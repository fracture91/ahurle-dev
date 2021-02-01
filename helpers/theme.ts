import {
  Theme as GenericTheme,
  ContextValue as GenericContextValue,
  useThemeUI as genericUseThemeUI,
} from "theme-ui"

const makeTheme = <T extends GenericTheme>(t: T) => t

export const theme = makeTheme({
  useColorSchemeMediaQuery: true, // default to the user's preferred mode
  initialColorModeName: "light",
  colors: {
    background: "white",
    text: "#333",
    primary: "#0070f3",
    modes: {
      dark: {
        background: "black",
        text: "white",
      },
    },
  },
  styles: {
    root: {
      backgroundColor: "background",
      color: "text",
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
