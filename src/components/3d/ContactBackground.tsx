"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface ContactBackgroundProps {
  mousePosition: { x: number; y: number }
}

export default function ContactBackground({ mousePosition }: ContactBackgroundProps) {
  const { viewport } = useThree()
  const count = 60
  const mesh = useRef<THREE.InstancedMesh>(null)
  const sphereMesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Safe theme detection
  const isDark = typeof window !== "undefined" ? document.documentElement.classList.contains("dark") : true

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 25
      const y = (Math.random() - 0.5) * 25
      const z = (Math.random() - 0.5) * 25 - 10
      const scale = Math.random() * 0.4 + 0.1
      const speed = Math.random() * 0.015 + 0.005
      const rotationSpeed = Math.random() * 0.02 + 0.01
      const type = Math.floor(Math.random() * 2)
      temp.push({ position: [x, y, z], scale, speed, rotationSpeed, type, originalScale: scale })
    }
    return temp
  }, [count])

  useFrame((state) => {
    if (!mesh.current || !sphereMesh.current) return

    const time = state.clock.getElapsedTime()
    let envelopeIndex = 0
    let sphereIndex = 0

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

      const newZ = ((position[2] + time * speed) % 30) - 15
      const dynamicScale = originalScale + interactionStrength * 1.2

      dummy.position.set(newX, newY, newZ)
      dummy.rotation.x = time * rotationSpeed
      dummy.rotation.y = time * rotationSpeed * 0.7
      dummy.rotation.z = time * rotationSpeed * 0.5
      dummy.scale.set(dynamicScale, dynamicScale, dynamicScale)
      dummy.updateMatrix()

      if (type === 0) {
        mesh.current!.setMatrixAt(envelopeIndex, dummy.matrix)
        envelopeIndex++
      } else {
        sphereMesh.current!.setMatrixAt(sphereIndex, dummy.matrix)
        sphereIndex++
      }
    })

    mesh.current.instanceMatrix.needsUpdate = true
    sphereMesh.current.instanceMatrix.needsUpdate = true
  })

  const envelopeCount = particles.filter((p) => p.type === 0).length
  const sphereCount = particles.filter((p) => p.type === 1).length

  const primaryColor = isDark ? "#3b82f6" : "#1d4ed8"
  const secondaryColor = isDark ? "#10b981" : "#059669"

  return (
    <>
      <ambientLight intensity={isDark ? 0.2 : 0.4} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 0.6 : 0.8} />
      <pointLight position={[-10, -10, -10]} intensity={isDark ? 0.3 : 0.4} color={secondaryColor} />

      <instancedMesh ref={mesh} args={[undefined, undefined, envelopeCount]}>
        <boxGeometry args={[1.5, 1, 0.1]} />
        <meshStandardMaterial
          color={primaryColor}
          transparent
          opacity={0.7}
          metalness={0.6}
          roughness={0.3}
          emissive={primaryColor}
          emissiveIntensity={0.1}
        />
      </instancedMesh>

      <instancedMesh ref={sphereMesh} args={[undefined, undefined, sphereCount]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color={secondaryColor}
          transparent
          opacity={0.6}
          metalness={0.8}
          roughness={0.2}
          emissive={secondaryColor}
          emissiveIntensity={0.15}
        />
      </instancedMesh>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={40}
            array={
              new Float32Array(
                Array.from({ length: 40 }, () => [
                  (Math.random() - 0.5) * 40,
                  (Math.random() - 0.5) * 40,
                  (Math.random() - 0.5) * 40,
                ]).flat(),
              )
            }
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.08} color={isDark ? "#ffffff" : "#000000"} transparent opacity={0.4} />
      </points>
    </>
  )
}
