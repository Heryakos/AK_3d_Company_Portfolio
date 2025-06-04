"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeProviderContextType = {
  theme: Theme
  toggleTheme: () => void
  resolvedTheme: Theme
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Safe localStorage access
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("portfolio-theme") as Theme
        if (stored && (stored === "dark" || stored === "light")) {
          return stored
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      } catch (error) {
        console.warn("Failed to access localStorage:", error)
        return "dark"
      }
    }
    return "dark"
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    try {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(theme)
      localStorage.setItem("portfolio-theme", theme)
    } catch (error) {
      console.warn("Failed to update theme:", error)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
          <p>Initializing theme...</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, toggleTheme, resolvedTheme: theme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
