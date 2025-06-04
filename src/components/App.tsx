"use client"

import { useEffect, useState } from "react"
import Hero from "./Hero"
import About from "./About"
import Services from "./Services"
import Portfolio from "./Portfolio"
import Contact from "./Contact"

function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Ensure app is fully mounted
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Portfolio...</h2>
          <p className="text-white/80">Preparing 3D environment</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Contact />
    </main>
  )
}

export default App
