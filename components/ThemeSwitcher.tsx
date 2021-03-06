/** @jsxImportSource theme-ui */
import { ColorMode, useThemeUI } from "@/helpers/theme"
import { useCallback } from "react"

class Mode {
  name: ColorMode

  constructor(name: ColorMode) {
    this.name = name
  }

  get id(): string {
    return `color-mode-${this.name}`
  }
}

const modes: Mode[] = [new Mode("light"), new Mode("dark")]

export const ThemeSwitcher: React.FC = () => {
  const { colorMode, setColorMode } = useThemeUI()
  const onChange = useCallback((event) => {
    // @ts-ignore
    setColorMode(event.target.value)
    // document.documentElement.classList.remove(`theme-ui-${colorMode}`)
    // document.documentElement.classList.add(`theme-ui-${event.target.value}`)
  }, [setColorMode])
  return (
    <div
      sx={{
        width: "6.4em",
        height: "1.7895em",
        div: { width: "1.6em", height: "1.6em" },
      }}
    >
      {modes.map((mode) => (
        <label key={mode.id} htmlFor={mode.id}>
          <input
            type="radio"
            id={mode.id}
            name="color-mode"
            value={mode.name}
            checked={colorMode === mode.name}
            onChange={onChange}
          />
          {mode.name[0].toUpperCase()}
        </label>
      ))}
    </div>
  )
}
