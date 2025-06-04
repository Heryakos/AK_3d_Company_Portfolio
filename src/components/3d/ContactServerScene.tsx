import { useGLTF } from "@react-three/drei"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface ContactServerSceneProps {
  scale?: number
  position?: [number, number, number]
}

export default function ContactServerScene({ scale = 1, position = [0, 0, 0] }: ContactServerSceneProps) {
  const { scene } = useGLTF("/Server/AK.glb")
  const groupRef = useRef<THREE.Group>(null)

  // Add gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene} />
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.4} color="#3b82f6" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
      <pointLight position={[0, -5, 5]} intensity={0.8} color="#f59e0b" />
      <spotLight 
        position={[5, 8, 5]} 
        angle={0.4} 
        penumbra={1} 
        intensity={1.8} 
        color="#ffffff"
        castShadow 
      />
      <spotLight 
        position={[-5, -8, 5]} 
        angle={0.4} 
        penumbra={1} 
        intensity={1} 
        color="#3b82f6" 
      />
    </group>
  )
} 
