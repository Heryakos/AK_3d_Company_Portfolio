"use client"

import { useState, useEffect } from "react"
import { Button } from "./button"
import { RotateCcw, ZoomIn, ZoomOut, Move3D, Smartphone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TouchControlsProps {
  onReset?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  className?: string
}

export function TouchControls({ onReset, onZoomIn, onZoomOut, className }: TouchControlsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect if device supports touch
    const checkMobile = () => {
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth < 768
      setIsMobile(isTouchDevice && isSmallScreen)
      setIsVisible(isTouchDevice && isSmallScreen)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!isMobile) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 right-6 z-40 ${className}`}
        >
          {/* Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsVisible(!isVisible)}
            className="mb-2 bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90 transition-all duration-300 shadow-lg"
          >
            <Smartphone className="h-4 w-4" />
          </Button>

          {/* Control Panel */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="bg-background/90 backdrop-blur-md border border-border/50 rounded-lg p-3 shadow-xl"
          >
            <div className="flex flex-col space-y-2">
              <div className="text-xs text-muted-foreground text-center mb-2 font-medium">3D Controls</div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onZoomIn}
                  className="h-12 flex flex-col items-center justify-center hover:bg-accent/50"
                >
                  <ZoomIn className="h-4 w-4 mb-1" />
                  <span className="text-xs">Zoom In</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onZoomOut}
                  className="h-12 flex flex-col items-center justify-center hover:bg-accent/50"
                >
                  <ZoomOut className="h-4 w-4 mb-1" />
                  <span className="text-xs">Zoom Out</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  className="h-12 flex flex-col items-center justify-center hover:bg-accent/50 col-span-2"
                >
                  <RotateCcw className="h-4 w-4 mb-1" />
                  <span className="text-xs">Reset View</span>
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center mt-2 p-2 bg-accent/20 rounded">
                <Move3D className="h-3 w-3 inline mr-1" />
                Touch & drag to rotate
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
