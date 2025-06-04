"use client"

import { useRef } from "react"
import { useFrame } from '@react-three/fiber';
import type * as THREE from "three"

interface SimpleServerModelProps {
  mousePosition?: { x: number; y: number }
}

export default function SimpleServerModel({ mousePosition = { x: 0, y: 0 } }: SimpleServerModelProps) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      const time = state.clock.getElapsedTime()
      group.current.rotation.y = Math.sin(time * 0.1) * 0.05 + mousePosition.x * 0.02
      group.current.position.y = Math.sin(time * 0.2) * 0.05
    }
  })

  return (
    <group ref={group} position={[0, -0.5, 0]} scale={1.2}>
      {/* Server Rack Frame */}
      <mesh position={[0, 0, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 3, 0.15]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Server Components */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.35, 0.7]} />
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.8}
          roughness={0.2}
          emissive="#3b82f6"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.35, 0.7]} />
        <meshStandardMaterial
          color="#06b6d4"
          metalness={0.8}
          roughness={0.2}
          emissive="#06b6d4"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.35, 0.7]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.8}
          roughness={0.2}
          emissive="#10b981"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh position={[0, -1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.35, 0.7]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.8}
          roughness={0.2}
          emissive="#f59e0b"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Status LEDs */}
      {[1, 0.3, -0.4, -1.1].map((y, i) => (
        <mesh key={i} position={[0.5, y, 0.37]} scale={0.04}>
          <sphereGeometry />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      ))}

      {/* Rack Rails */}
      <mesh position={[-0.7, 0, -0.2]} castShadow>
        <boxGeometry args={[0.05, 3, 0.1]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.7, 0, -0.2]} castShadow>
        <boxGeometry args={[0.05, 3, 0.1]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#3b82f6" />
      <pointLight position={[-5, 5, 5]} intensity={0.8} color="#8b5cf6" />
    </group>
  )
}
