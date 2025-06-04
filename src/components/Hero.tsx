"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { PerformanceToggle } from "./ui/performance-toggle"
import { TouchControls } from "./ui/touch-controls"
import { Header } from "./ui/header"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, useGLTF } from "@react-three/drei"
import ParticleBackground from "./3d/ParticleBackground"

// Simple server scene component that only uses R3F hooks within Canvas
function ServerRackScene({ mousePosition, isMobile }: { mousePosition: { x: number; y: number }; isMobile: boolean }) {
  const { scene } = useGLTF("/Server/server_v2_console.glb")

  return (
    <group position={[0, -1, 0]} scale={isMobile ? 0.4 : 0.6}>
      <primitive object={scene} />
      
      {/* Enhanced Lighting Setup */}
      <ambientLight intensity={isMobile ? 0.5 : 0.6} />
      <pointLight position={[5, 5, 5]} intensity={isMobile ? 0.8 : 1.2} color="#3b82f6" />
      <pointLight position={[-5, 5, 5]} intensity={isMobile ? 0.6 : 1} color="#8b5cf6" />
      <pointLight position={[0, -5, 5]} intensity={isMobile ? 0.4 : 0.6} color="#f59e0b" />
      {!isMobile && (
        <>
          <spotLight position={[0, 8, 0]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
          <spotLight position={[0, -8, 0]} angle={0.3} penumbra={1} intensity={0.5} color="#3b82f6" />
        </>
      )}
    </group>
  )
}

export default function Hero() {
  const [isClient, setIsClient] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const controlsRef = useRef<any>(null)

  // Detect device type
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0

      setIsMobile(width < 768 && isTouchDevice)
      setIsTablet(width >= 768 && width < 1024 && isTouchDevice)
    }

    checkDeviceType()
    window.addEventListener("resize", checkDeviceType)
    return () => window.removeEventListener("resize", checkDeviceType)
  }, [])

  // Safe theme detection without useTheme hook
  useEffect(() => {
    setMounted(true)

    // Detect initial theme
    if (typeof window !== "undefined") {
      const darkMode =
        document.documentElement.classList.contains("dark") || window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDark(darkMode)
    }

    // Theme change observer
    const observer = new MutationObserver(() => {
      if (typeof window !== "undefined") {
        setIsDark(document.documentElement.classList.contains("dark"))
      }
    })

    if (typeof window !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
    }

    const timer = setTimeout(() => {
      setIsClient(true)
    }, 500)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleMouseMove = (event: MouseEvent) => {
      // Reduce mouse sensitivity on mobile/tablet
      const sensitivity = isMobile ? 0.5 : 1
      setMousePosition({
        x: ((event.clientX / window.innerWidth) * 2 - 1) * sensitivity,
        y: (-(event.clientY / window.innerHeight) * 2 + 1) * sensitivity,
      })
    }

    // Only add mouse listener on non-touch devices
    if (!isMobile && !isTablet) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mounted, isMobile, isTablet])

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const root = document.documentElement
      const newTheme = root.classList.contains("dark") ? "light" : "dark"

      root.classList.remove("light", "dark")
      root.classList.add(newTheme)

      try {
        localStorage.setItem("portfolio-theme", newTheme)
      } catch (error) {
        console.warn("Failed to save theme:", error)
      }

      setIsDark(newTheme === "dark")
    }
  }

  // Touch control handlers
  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  const handleZoomIn = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object
      camera.position.multiplyScalar(0.8)
      controlsRef.current.update()
    }
  }

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object
      camera.position.multiplyScalar(1.2)
      controlsRef.current.update()
    }
  }

  const handleServicesClick = () => {
    const element = document.querySelector("#services")
    if (element) {
      const headerHeight = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  if (!mounted) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-6"></div>
          <h1 className="mb-6 text-3xl sm:text-5xl font-bold text-white md:text-7xl">
            Server Infrastructure <span className="text-blue-400">Specialists</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg sm:text-xl text-white/80 px-4">
            Expert server hardware sales, custom builds, Windows/Linux deployment, and cloud integration solutions
          </p>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Header Navigation */}
      <Header isDark={isDark} onToggleTheme={toggleTheme} />

      <section id="home" className="relative h-screen w-full overflow-hidden">
        {/* Performance Monitor Toggle - Hidden on mobile */}
        {!isMobile && <PerformanceToggle onToggle={setShowPerformanceMonitor} />}

        {/* Touch Controls for Mobile */}
        <TouchControls onReset={handleReset} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />

        {/* Interactive Background */}
        <div className="absolute inset-0 z-0">
          {isClient && (
            <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10" />}>
              <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <ParticleBackground mousePosition={mousePosition} isDark={isDark} />
              </Canvas>
            </Suspense>
          )}
        </div>

        {/* Main Content - Responsive Layout */}
        <div className={`relative z-10 h-full ${isMobile ? "flex flex-col" : "grid grid-cols-1 lg:grid-cols-2"} items-center pt-16 lg:pt-20`}>
          {/* Content Section */}
          <div
            className={`flex flex-col justify-center ${isMobile ? "px-4 pt-8 pb-8" : "px-6 lg:px-12 xl:px-16"} space-y-6 ${
              isMobile ? "text-center" : ""
            }`}
          >
            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 30 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4 relative"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className={`font-bold text-foreground leading-tight ${
                  isMobile ? "text-3xl" : isTablet ? "text-4xl" : "text-4xl md:text-5xl xl:text-6xl"
                }`}
              >
                Enterprise Server{" "}
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-primary block lg:inline"
                >
                  Solutions by AK
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className={`text-muted-foreground leading-relaxed ${
                  isMobile
                    ? "text-base max-w-sm mx-auto"
                    : isTablet
                      ? "text-lg max-w-lg"
                      : "text-lg xl:text-xl max-w-xl"
                }`}
              >
                Ethiopia's premier server infrastructure provider, specializing in enterprise hardware sales, 
                international exports, and advanced server configurations for modern businesses.
              </motion.p>
            </motion.div>

            {/* Action Buttons - Mobile Optimized */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className={`flex gap-4 ${isMobile ? "flex-col max-w-xs mx-auto" : "flex-col sm:flex-row max-w-md"}`}
            >
              <Button
                size={isMobile ? "default" : "lg"}
                onClick={handleServicesClick}
                className={`bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isMobile ? "py-3 text-base" : "px-8 py-4 text-base transform hover:scale-105"
                }`}
              >
                View Services
              </Button>
              <Button
                size={isMobile ? "default" : "lg"}
                variant="outline"
                onClick={() => {
                  const element = document.querySelector("#contact")
                  if (element) {
                    const headerHeight = 80
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                    const offsetPosition = elementPosition - headerHeight
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" })
                  }
                }}
                className={`border-2 border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary font-semibold transition-all duration-300 ${
                  isMobile ? "py-3 text-base" : "px-8 py-4 text-base transform hover:scale-105"
                }`}
              >
                Get Quote
              </Button>
            </motion.div>

            {/* Stats - Mobile Layout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className={`grid grid-cols-3 gap-4 pt-6 ${isMobile ? "max-w-xs mx-auto" : "max-w-md"}`}
            >
              {[
                { number: "150+", label: "Global Clients" },
                { number: "24/7", label: "Tech Support" },
                { number: "100%", label: "Hardware Warranty" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`font-bold text-primary ${isMobile ? "text-lg" : "text-2xl"}`}>{stat.number}</div>
                  <div className={`text-muted-foreground ${isMobile ? "text-xs" : "text-sm"}`}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 3D Visualization - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 30 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className={`relative ${isMobile ? "h-64 flex-1" : "h-full min-h-[500px] lg:min-h-full"}`}
          >
            {isClient && (
              <Suspense
                fallback={
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
                      <p className={isMobile ? "text-sm" : "text-base"}>Loading 3D Scene...</p>
                    </div>
                  </div>
                }
              >
                <Canvas
                  camera={{
                    position: isMobile ? [0, 0, 6] : [0, 0, 7],
                    fov: isMobile ? 50 : 45,
                  }}
                  className="h-full w-full"
                  performance={{ min: isMobile ? 0.3 : 0.5 }}
                >
                  <ServerRackScene mousePosition={mousePosition} isMobile={isMobile} />
                  <OrbitControls
                    ref={controlsRef}
                    enableZoom={!isMobile}
                    enablePan={false}
                    autoRotate={!isMobile}
                    autoRotateSpeed={isMobile ? 0 : 1}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI * 2/3}
                    minAzimuthAngle={-Math.PI / 2}
                    maxAzimuthAngle={Math.PI / 2}
                    rotateSpeed={0.5}
                  />
                  <Environment preset={isDark ? "night" : "sunset"} />
                </Canvas>
              </Suspense>
            )}

            {/* 3D Interaction Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              className={`absolute bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 text-muted-foreground border shadow-lg ${
                isMobile ? "bottom-4 left-4 text-xs" : "bottom-8 left-8 text-sm"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {isMobile ? "Touch to rotate" : "Interactive 3D Server Rack"}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        {!isMobile && (
          <motion.button
            onClick={() => {
              const servicesSection = document.querySelector("#services")
              if (servicesSection) {
                const headerHeight = 80
                const elementPosition = servicesSection.getBoundingClientRect().top + window.pageYOffset
                const offsetPosition = elementPosition - headerHeight
                window.scrollTo({ top: offsetPosition, behavior: "smooth" })
              }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-full p-2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="flex flex-col items-center text-muted-foreground group"
            >
              <span className="text-sm mb-2 group-hover:text-primary transition-colors">Scroll to explore</span>
              <ChevronDown className="w-5 h-5 group-hover:text-primary transition-colors" />
            </motion.div>
          </motion.button>
        )}
      </section>
    </>
  )
}
