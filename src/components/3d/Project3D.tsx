"use client"

import { useGLTF } from "@react-three/drei"

const modelPaths: Record<string, string> = {
  cloud: "/Server/Tower_Server_color.glb",
  server: "/Server/SingleServer.glb",
  database: "/Server/Storage_Server.glb",
  security: "/Server/Server_with_rack.glb",
  network: "/Server/Server.glb",
  infrastructure: "/Server/Tower Servers.glb"
}

export default function Project3D({ model }: { model: string }) {
  const { scene } = useGLTF(modelPaths[model])

  return (
    <group position={[0, 0, 0]} scale={1.5}>
      <primitive object={scene} />
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, 10, 10]} intensity={0.5} />
    </group>
  )
}
