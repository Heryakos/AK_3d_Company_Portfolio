"use client"

import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Html } from "@react-three/drei"

interface PerformanceStats {
  fps: number
  frameTime: number
  particleCount: number
  drawCalls: number
}

interface PerformanceMonitorProps {
  particleCount?: number
  visible?: boolean
}

export default function PerformanceMonitor({ particleCount = 0, visible = true }: PerformanceMonitorProps) {
  const { gl } = useThree()
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    particleCount: 0,
    drawCalls: 0,
  })

  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const fpsHistory = useRef<number[]>([])

  // Safe theme detection without useTheme hook
  const isDark = typeof window !== "undefined" ? document.documentElement.classList.contains("dark") : true

  useFrame(() => {
    const now = performance.now()
    const deltaTime = now - lastTime.current
    frameCount.current++

    // Calculate FPS every 10 frames for smoother updates
    if (frameCount.current % 10 === 0) {
      const fps = Math.round(1000 / deltaTime)
      const frameTime = Math.round(deltaTime * 100) / 100

      // Keep history for averaging
      fpsHistory.current.push(fps)

      if (fpsHistory.current.length > 30) {
        fpsHistory.current.shift()
      }

      // Calculate averages
      const avgFps = Math.round(fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length)

      // Get renderer info
      const info = gl.info

      setStats({
        fps: avgFps,
        frameTime: frameTime,
        particleCount,
        drawCalls: info.render?.calls || 0,
      })
    }

    lastTime.current = now
  })

  if (!visible) return null

  return (
    <Html position={[-8, 4, 0]} transform={false} occlude={false}>
      <div
        className={`
          bg-black/90 backdrop-blur-md border border-gray-600/50 rounded-lg p-3 
          text-xs font-mono shadow-lg min-w-[200px] transition-all duration-300
          ${isDark ? "text-white border-gray-600" : "text-black border-gray-300 bg-white/90"}
        `}
        style={{
          fontFamily: "monospace",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-600/30">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-semibold">Performance Monitor</span>
        </div>

        <div className="space-y-1">
          {/* FPS with color coding */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">FPS:</span>
            <span
              className={`font-bold ${
                stats.fps >= 60
                  ? "text-green-500"
                  : stats.fps >= 30
                    ? "text-yellow-500"
                    : stats.fps >= 15
                      ? "text-orange-500"
                      : "text-red-500"
              }`}
            >
              {stats.fps}
            </span>
          </div>

          {/* Frame Time */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Frame Time:</span>
            <span>{stats.frameTime}ms</span>
          </div>

          {/* Particle Count */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Particles:</span>
            <span className="text-blue-400 font-semibold">{stats.particleCount.toLocaleString()}</span>
          </div>

          {/* Draw Calls */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Draw Calls:</span>
            <span>{stats.drawCalls}</span>
          </div>
        </div>

        {/* Performance Bar */}
        <div className="mt-3 pt-2 border-t border-gray-600/30">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Performance</span>
            <span>{Math.round((stats.fps / 60) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                stats.fps >= 60
                  ? "bg-green-500"
                  : stats.fps >= 30
                    ? "bg-yellow-500"
                    : stats.fps >= 15
                      ? "bg-orange-500"
                      : "bg-red-500"
              }`}
              style={{ width: `${Math.min((stats.fps / 60) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Html>
  )
}
