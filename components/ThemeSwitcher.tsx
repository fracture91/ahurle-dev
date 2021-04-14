// getPreferredColorScheme is not normally exported, but I patched that in
import { getPreferredColorScheme } from "@theme-ui/color-modes"
import { SxProp } from "theme-ui"
import {
  browserKbFocusStyles,
  ColorMode,
  theme,
  useColorMode,
} from "@/helpers/theme"
import {
  ChangeEvent,
  ComponentType,
  useCallback,
  useEffect,
  useState,
} from "react"
import { useLocalStorage } from "react-use"
import { WrapFC } from "@/helpers/WrapFC"
import { Moon } from "./Moon"
import { Sun } from "./Sun"
import { SunAndMoon } from "./SunAndMoon"

type RequiredIconProps = { secondaryColor: string } & SxProp

class MetaMode<T = unknown> {
  themeUIColorMode?: ColorMode
  name: string
  id: string
  title: string
  icon: ComponentType<T & RequiredIconProps>

  constructor(
    { title, icon }: Pick<MetaMode<T>, "title" | "icon">,
    themeUIColorMode?: ColorMode,
    name?: string
  ) {
    this.title = title
    this.icon = icon
    this.themeUIColorMode = themeUIColorMode
    const actualName = name || themeUIColorMode
    if (!actualName) throw new Error("name required")
    this.name = actualName
    this.id = `color-mode-${this.name}`
  }

  static auto = new MetaMode(
    { title: "Use system default color scheme", icon: SunAndMoon },
    undefined,
    "auto"
  )

  static all: MetaMode[] = [
    MetaMode.auto,
    new MetaMode({ title: "Use light color scheme", icon: Sun }, "light"),
    new MetaMode({ title: "Use dark color scheme", icon: Moon }, "dark"),
  ]
}

const ThemeButton: WrapFC<
  "input",
  {
    mode: MetaMode
    onChange: (
      selectedMode: MetaMode,
      _event: ChangeEvent<HTMLInputElement>
    ) => void
  },
  "onChange"
> = ({ mode, onChange, checked, ...rest }) => (
  <label
    htmlFor={mode.id}
    title={mode.title}
    sx={{
      cursor: "pointer",
      zIndex: 2,
      position: "relative",
      color: "text",
      display: "flex",
      alignItems: "center",
    }}
  >
    <input
      type="radio"
      id={mode.id}
      name="color-mode"
      value={mode.name}
      onChange={onChange.bind(null, mode)}
      checked={checked}
      aria-label={mode.title}
      {...rest}
      sx={{ position: "absolute", opacity: 0.00001, cursor: "pointer" }}
    />
    <mode.icon
      secondaryColor={checked ? "background.switchSelected" : "background"}
      sx={{
        mx: "0.2em",
        my: "0.2em",
        cursor: "pointer",
        verticalAlign: "middle",
        height: "1.2em",
        color: checked ? "text.switchSelected" : "text",
        "input:focus-visible ~ &": browserKbFocusStyles,
      }}
    />
  </label>
)

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

  const [firstRender, setFirstRender] = useState(true)
  const metaMode: MetaMode | undefined = MetaMode.all.find(
    // on server persistedMode is always undefined, so make sure first render matches
    (m) => m.themeUIColorMode === (firstRender ? undefined : persistedMode)
  )
  if (!metaMode) throw new Error("could not map state to a MetaMode")
  const selectedIndex = MetaMode.all.indexOf(metaMode)

  useEffect(() => {
    setFirstRender(false) // forces a second render to correct disabled/check state
    if (persistedMode) setColorModeAndClass(persistedMode)
    // really only want this to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onMediaChange = useCallback(
    (event) => {
      if (metaMode !== MetaMode.auto) return
      setColorModeAndClass(event.matches ? "dark" : "light", {
        removeClass: true,
      })
    },
    [metaMode, setColorModeAndClass]
  )

  useEffect(() => {
    if (!window.matchMedia) return
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)")
    matchMedia.addEventListener("change", onMediaChange)
    // eslint-disable-next-line consistent-return
    return () => {
      matchMedia.removeEventListener("change", onMediaChange)
    }
  }, [onMediaChange])

  const onChange = useCallback(
    (selectedMode: MetaMode, _event: ChangeEvent<HTMLInputElement>) => {
      if (!selectedMode.themeUIColorMode) {
        setColorModeAndClass(
          getPreferredColorScheme() || theme.initialColorModeName,
          // note that by removing the class I'm relying on DarkMediaStyle here
          { removeClass: true }
        )
        removePersistedMode()
      } else {
        setColorModeAndClass(selectedMode.themeUIColorMode)
        setPersistedMode(selectedMode.themeUIColorMode)
      }
    },
    [removePersistedMode, setColorModeAndClass, setPersistedMode]
  )

  return (
    <div
      sx={{
        p: "0.05em 0.1em",
        mr: "0.5em",
        bg: selectedIndex > 0 ? "primary.background" : "lower",
        borderRadius: "1em",
        boxShadow: (t) =>
          [
            `0px 2px 2px ${t.colors?.lower} inset`,
            selectedIndex > 0 ? [`0 0 5px 2px ${t.colors?.higher} inset`] : [],
          ]
            .flat()
            .join(","),
        flexShrink: 0,
        display: "grid",
        gridTemplateColumns: MetaMode.all.map(() => "1fr").join(" "),
        transition: "background 300ms ease, box-shadow 300ms ease",
      }}
    >
      <div
        sx={{
          width: "1.36em",
          height: "1.36em",
          borderRadius: "50%",
          bg: "background.switchSelected",
          position: "absolute",
          mt: "0.11em",
          ml: "0.1em",
          transform: `translateX(${selectedIndex * 1.62}em)`,
          transition:
            "transform 240ms cubic-bezier(0.165, 0.840, 0.440, 1.000)",
          zIndex: 1,
          boxShadow: "0px 2px 2px #0004",
        }}
      />
      {/* Watch out for this emotion bug when using anonymous functions wrapping components using sx:
       * https://github.com/emotion-js/emotion/issues/2134
       */}
      {MetaMode.all.map((mode) => (
        <ThemeButton
          key={mode.id}
          mode={mode}
          // if JS is disabled, this should be disabled
          disabled={firstRender}
          checked={metaMode === mode}
          onChange={onChange}
        />
      ))}
    </div>
  )
}
