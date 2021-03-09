import React, { useEffect } from "react"

/** A class that will be present on the root element before hydration happens */
export const preLoadClass = "pre-load"

/**
 * Certain CSS rules need to apply only after the page has loaded.
 * This component removes `preLoadClass` from root after load to facilitate that.
 */
export const RemovePreLoadClass: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.remove(preLoadClass)
  }, [])
  return null
}
