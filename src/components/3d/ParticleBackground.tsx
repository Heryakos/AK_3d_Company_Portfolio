"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface ParticleBackgroundProps {
  mousePosition: { x: number; y: number }
  isDark: boolean
}

export default function ParticleBackground({ mousePosition, isDark }: ParticleBackgroundProps) {
  const points = useRef<THREE.Points>(null)
  const particlesCount = 2000
  
  // Create particles with consistent positions
  const positions = new Float32Array(particlesCount * 3)
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50
  }

  useFrame((state) => {
    if (!points.current) return

    // Gentle wave motion
    const time = state.clock.getElapsedTime() * 0.1
    const positions = points.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particlesCount; i++) {
      const x = i * 3
      const y = i * 3 + 1
      
      // Add subtle wave motion
      positions[y] += Math.sin(time + positions[x]) * 0.01
      
      // Add mouse interaction
      const distance = Math.sqrt(
        Math.pow(positions[x] - mousePosition.x * 10, 2) +
        Math.pow(positions[y] - mousePosition.y * 10, 2)
      )
      
      if (distance < 5) {
        positions[x] += (mousePosition.x * 10 - positions[x]) * 0.02
        positions[y] += (mousePosition.y * 10 - positions[y]) * 0.02
      }
    }

    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation={true}
        transparent={false}
        color={isDark ? "#ffffff" : "#000000"}
        opacity={isDark ? 0.8 : 0.5}
        fog={false}
      />
    </points>
  )
} 