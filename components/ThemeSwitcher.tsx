/** @jsxImportSource theme-ui */
// getPreferredColorScheme is not normally exported, but I patched that in
import { getPreferredColorScheme } from "@theme-ui/color-modes"
import { ColorMode, theme, useColorMode } from "@/helpers/theme"
import { useCallback, useEffect } from "react"
import { useLocalStorage } from "react-use"

class MetaMode {
  themeUIColorMode?: ColorMode

  name: string

  id: string

  constructor(themeUIColorMode?: ColorMode, name?: string) {
    this.themeUIColorMode = themeUIColorMode
    const actualName = name || themeUIColorMode
    if (!actualName) throw new Error("name required")
    this.name = actualName
    this.id = `color-mode-${this.name}`
  }

  static all: MetaMode[] = [
    new MetaMode(undefined, "auto"),
    new MetaMode("light"),
    new MetaMode("dark"),
  ]
}

// same key that theme-ui uses when useLocalStorage: true
const STORAGE_KEY = "theme-ui-color-mode"
// same prefix used by InitializeColorMode
const CLASS_PREFIX = "theme-ui-"

export const ThemeSwitcher: React.FC = () => {
  const [, setThemeUIColorMode] = useColorMode()
  const setColorModeAndClass = useCallback(
    (
      mode: ColorMode,
      { removeClass }: { removeClass: boolean } = { removeClass: false }
    ) => {
      setThemeUIColorMode(mode)
      // Theme-ui usually changes the value of CSS vars on the root element.
      // However, it seems like this emotion bug prevents that from working
      // since the new global styles are getting inserted *before* the SSR'd styles,
      // so the SSR'd styles take precedence over the client-side overrides.
      // https://github.com/emotion-js/emotion/issues/2158
      // Get around this by using the classname-based overrides theme-ui includes,
      // originally to avoid FOUC with localStorage.  This also helps our no-JS
      // DarkMediaStyle avoid clashing with yes-JS behavior.
      // Note that this is paired with a theme-ui patch to avoid removing class on startup.
      ;[document.documentElement, document.body].forEach((el) => {
        el.classList.forEach((value, _key, parent) =>
          value.startsWith(CLASS_PREFIX) ? parent.remove(value) : null
        )
        if (!removeClass) el.classList.add(`${CLASS_PREFIX}${mode}`)
      })
    },
    [setThemeUIColorMode]
  )
  const [
    persistedMode,
    setPersistedMode,
    removePersistedMode,
  ] = useLocalStorage<ColorMode | undefined>(STORAGE_KEY, undefined, {
    raw: true,
  })

  const metaMode: MetaMode | undefined = MetaMode.all.find(
    (m) => m.themeUIColorMode === persistedMode
  )
  if (!metaMode) throw new Error("could not map state to a MetaMode")

  useEffect(() => {
    if (persistedMode) setColorModeAndClass(persistedMode)
    // really only want this to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChange = useCallback(
    (event) => {
      if (event.target.value === "auto") {
        setColorModeAndClass(
          getPreferredColorScheme() || theme.initialColorModeName,
          // note that by removing the class I'm relying on DarkMediaStyle here
          { removeClass: true }
        )
        removePersistedMode()
      } else {
        setColorModeAndClass(event.target.value)
        setPersistedMode(event.target.value)
      }
    },
    [removePersistedMode, setColorModeAndClass, setPersistedMode]
  )

  return (
    <div
      sx={{
        width: "6.4em",
        height: "1.7895em",
        div: { width: "1.6em", height: "1.6em" },
      }}
    >
      {MetaMode.all.map((mode) => (
        <label key={mode.id} htmlFor={mode.id}>
          <input
            type="radio"
            id={mode.id}
            name="color-mode"
            value={mode.name}
            // without this window check the browser seems to get confused about the current selection
            checked={typeof window === "undefined" ? false : metaMode === mode}
            onChange={onChange}
          />
          {mode.name[0].toUpperCase()}
        </label>
      ))}
    </div>
  )
}
