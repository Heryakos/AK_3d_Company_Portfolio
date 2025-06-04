"use client"

import { useGLTF } from "@react-three/drei"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface PlanetSceneProps {
  scale?: number
  position?: [number, number, number]
}

export default function PlanetScene({ scale = 1, position = [0, 0, 0] }: PlanetSceneProps) {
  const { scene } = useGLTF("/planet/scene.gltf")
  const groupRef = useRef<THREE.Group>(null)

  // Add gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene} />
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#3b82f6" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[0, -5, 5]} intensity={0.6} color="#f59e0b" />
      <spotLight 
        position={[5, 8, 5]} 
        angle={0.4} 
        penumbra={1} 
        intensity={1.5} 
        color="#ffffff"
        castShadow 
      />
      <spotLight 
        position={[-5, -8, 5]} 
        angle={0.4} 
        penumbra={1} 
        intensity={0.8} 
        color="#3b82f6" 
      />
    </group>
  )
} 