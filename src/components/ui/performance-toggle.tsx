"use client"

import { useState } from "react"
import { Button } from "./button"
import { Monitor, MonitorOff } from "lucide-react"

interface PerformanceToggleProps {
  onToggle: (visible: boolean) => void
  className?: string
}

export function PerformanceToggle({ onToggle, className }: PerformanceToggleProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleToggle = () => {
    const newState = !isVisible
    setIsVisible(newState)
    onToggle(newState)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className={`fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm ${className}`}
      title={isVisible ? "Hide Performance Monitor" : "Show Performance Monitor"}
    >
      {isVisible ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
      <span className="ml-2 text-xs">{isVisible ? "Hide Stats" : "Show Stats"}</span>
    </Button>
  )
}
