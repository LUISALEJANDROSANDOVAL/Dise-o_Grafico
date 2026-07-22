import { useState, useEffect } from "react"

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("light")

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark"
    if (storedTheme) {
      setThemeState(storedTheme)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark")
    }
  }, [])

  const setTheme = (newTheme: "light" | "dark" | ((prev: "light" | "dark") => "light" | "dark")) => {
    setThemeState((prev) => {
      const resolvedTheme = typeof newTheme === "function" ? newTheme(prev) : newTheme
      localStorage.setItem("theme", resolvedTheme)
      return resolvedTheme
    })
  }

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.classList.toggle("light", theme === "light")
  }, [theme])

  return [theme, setTheme] as const
}
