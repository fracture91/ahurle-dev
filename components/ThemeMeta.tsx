import { useThemeUI, colorModes } from "@/helpers/theme"
import Head from "next/head"

export const ThemeMeta: React.FC = () => {
  const { theme } = useThemeUI()

  return (
    <Head>
      <meta name="theme-color" content={theme.colors.primary} />
      <meta name="color-scheme" content={colorModes.join(" ")} />
    </Head>
  )
}
