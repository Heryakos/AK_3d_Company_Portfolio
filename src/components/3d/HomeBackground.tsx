"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface HomeBackgroundProps {
  mousePosition: { x: number; y: number }
}

export default function HomeBackground({ mousePosition }: HomeBackgroundProps) {
  const { viewport } = useThree()
  const count = 60
  const mesh = useRef<THREE.InstancedMesh>(null)
  const sphereMesh = useRef<THREE.InstancedMesh>(null)
  const torusMesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Safe theme detection
  const isDark = typeof window !== "undefined" ? document.documentElement.classList.contains("dark") : true

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 30
      const y = (Math.random() - 0.5) * 30
      const z = (Math.random() - 0.5) * 30 - 10
      const scale = Math.random() * 0.4 + 0.1
      const speed = Math.random() * 0.015 + 0.003
      const rotationSpeed = Math.random() * 0.015 + 0.005
      const type = Math.floor(Math.random() * 3)
      temp.push({ position: [x, y, z], scale, speed, rotationSpeed, type, originalScale: scale })
    }
    return temp
  }, [count])

  useFrame((state) => {
    if (!mesh.current || !sphereMesh.current || !torusMesh.current) return

    const time = state.clock.getElapsedTime()
    let boxIndex = 0
    let sphereIndex = 0
    let torusIndex = 0

    particles.forEach((particle, i) => {
      const { position, scale, speed, rotationSpeed, type, originalScale } = particle

      const mouseX = (mousePosition.x * viewport.width) / 2
      const mouseY = (mousePosition.y * viewport.height) / 2
      const distance = Math.sqrt(Math.pow(position[0] - mouseX, 2) + Math.pow(position[1] - mouseY, 2))

      const interactionRadius = 4
      const isNearMouse = distance < interactionRadius
      const interactionStrength = isNearMouse ? 1 - distance / interactionRadius : 0

      let newX = position[0]
      let newY = position[1]

      if (isNearMouse) {
        const pushStrength = interactionStrength * 1.5
        const angle = Math.atan2(position[1] - mouseY, position[0] - mouseX)
        newX += Math.cos(angle) * pushStrength
        newY += Math.sin(angle) * pushStrength
      }

      const newZ = ((position[2] + time * speed) % 40) - 20
      const dynamicScale = originalScale + interactionStrength * 1

      dummy.position.set(newX, newY, newZ)
      dummy.rotation.x = time * rotationSpeed
      dummy.rotation.y = time * rotationSpeed * 0.7
      dummy.rotation.z = time * rotationSpeed * 0.5
      dummy.scale.set(dynamicScale, dynamicScale, dynamicScale)
      dummy.updateMatrix()

      if (type === 0) {
        mesh.current!.setMatrixAt(boxIndex, dummy.matrix)
        boxIndex++
      } else if (type === 1) {
        sphereMesh.current!.setMatrixAt(sphereIndex, dummy.matrix)
        sphereIndex++
      } else {
        torusMesh.current!.setMatrixAt(torusIndex, dummy.matrix)
        torusIndex++
      }
    })

    mesh.current.instanceMatrix.needsUpdate = true
    sphereMesh.current.instanceMatrix.needsUpdate = true
    torusMesh.current.instanceMatrix.needsUpdate = true
  })

  const boxCount = particles.filter((p) => p.type === 0).length
  const sphereCount = particles.filter((p) => p.type === 1).length
  const torusCount = particles.filter((p) => p.type === 2).length

  const primaryColor = isDark ? "#3b82f6" : "#1d4ed8"
  const secondaryColor = isDark ? "#8b5cf6" : "#7c3aed"
  const accentColor = isDark ? "#06b6d4" : "#0891b2"

  return (
    <>
      <ambientLight intensity={isDark ? 0.2 : 0.4} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 0.6 : 0.8} />
      <pointLight position={[-10, -10, -10]} intensity={isDark ? 0.3 : 0.4} color={secondaryColor} />

      <instancedMesh ref={mesh} args={[undefined, undefined, boxCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={primaryColor}
          transparent
          opacity={0.4}
          metalness={0.6}
          roughness={0.3}
          emissive={primaryColor}
          emissiveIntensity={0.05}
        />
      </instancedMesh>

      <instancedMesh ref={sphereMesh} args={[undefined, undefined, sphereCount]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={secondaryColor}
          transparent
          opacity={0.3}
          metalness={0.8}
          roughness={0.2}
          emissive={secondaryColor}
          emissiveIntensity={0.08}
        />
      </instancedMesh>

      <instancedMesh ref={torusMesh} args={[undefined, undefined, torusCount]}>
        <torusGeometry args={[1, 0.4, 8, 16]} />
        <meshStandardMaterial
          color={accentColor}
          transparent
          opacity={0.5}
          metalness={0.7}
          roughness={0.1}
          emissive={accentColor}
          emissiveIntensity={0.1}
        />
      </instancedMesh>

      <group>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[i * 5 - 20, 0, -20]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.01, 40]} />
            <meshBasicMaterial color={primaryColor} transparent opacity={0.1} />
          </mesh>
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0, i * 5 - 20, -20]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[0.01, 40]} />
            <meshBasicMaterial color={primaryColor} transparent opacity={0.1} />
          </mesh>
        ))}
      </group>
    </>
  )
}
