"use client"

import { useGLTF } from "@react-three/drei"

const modelPaths: Record<string, string> = {
  cloud: "public/Server/Tower_Server_color.glb",
  server: "public/Server/SingleServer.glb",
  database: "public/Server/Storage_Server.glb",
  security: "public/Server/Server_with_rack.glb",
  network: "public/Server/Server.glb",
  infrastructure: "public/Server/Tower Servers.glb"
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
