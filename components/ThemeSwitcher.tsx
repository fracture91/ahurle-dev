/** @jsxImportSource theme-ui */
import { ColorMode, useColorMode } from "@/helpers/theme"
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

const STORAGE_KEY = "theme-ui-color-mode"

export const ThemeSwitcher: React.FC = () => {
  const [, setThemeUIColorMode] = useColorMode()
  const setColorModeAndClass = useCallback(
    (
      mode: ColorMode,
      { removeClass }: { removeClass: boolean } = { removeClass: false }
    ) => {
      setThemeUIColorMode(mode)
      ;[document.documentElement, document.body].forEach((el) => {
        // el.classList.remove(`theme-ui-${prevMode.current}`)
        el.classList.forEach((value, _key, parent) =>
          value.startsWith("theme-ui-") ? parent.remove(value) : null
        )
        if (!removeClass) el.classList.add(`theme-ui-${mode}`)
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
        setColorModeAndClass("light", { removeClass: true }) // TODO: follow system pref
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
