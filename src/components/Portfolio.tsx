"use client"

import { useState, Suspense, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import Project3D from "./3d/Project3D"

const categories = ["All", "Tower Server", "Rack Server", "Storage",]

const projects = [
  {
    id: 1,
    title: "Tower Server",
    category: "Tower Server",
    description: "tower server for small and medium businesses",
    model: "cloud",
  },
  {
    id: 2,
    title: "Rack Server",
    category: "Rack Server",
    description: "rack server for small and medium businesses",
    model: "server",
  },
  {
    id: 3,
    title: "Storage",
    category: "Storage",
    description: "storage for small and medium businesses",
    model: "database",
  },
  {
    id: 4,
    title: "Retail Security Infrastructure",
    category: "Storage",
    description: "End-to-end security implementation with redundant server systems.",
    model: "security",
  },
  {
    id: 5,
    title: "Network Infrastructure",
    category: "Rack Server",
    description: "Connected infrastructure with secure networking and real-time monitoring.",
    model: "network",
  },
  {
    id: 6,
    title: "Cloud Computing Center",
    category: "Tower Server",
    description: "High-performance computing infrastructure for cloud operations.",
    model: "infrastructure",
  },
]

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const filteredProjects =
    activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory)

  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">Our Products</h2>
          <div className="mx-auto h-1 w-24 bg-primary"></div>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
            See our products and services 
          </p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={activeCategory === category ? "bg-primary" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-lg bg-card shadow-lg border hover:shadow-xl transition-shadow"
            >
              {/* Interactive 3D Preview */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                {isClient && (
                  <Suspense
                    fallback={
                      <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 animate-pulse flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm">Loading 3D Model...</p>
                        </div>
                      </div>
                    }
                  >
                    <Canvas 
                      camera={{ 
                        position: [0, 0, 4], 
                        fov: 50 
                      }}
                      className="h-full w-full"
                    >
                      <Project3D model={project.model} />
                      <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={true}
                        autoRotate={true}
                        autoRotateSpeed={2}
                        minPolarAngle={Math.PI / 3}
                        maxPolarAngle={Math.PI * 2/3}
                      />
                      <Environment preset="city" />
                    </Canvas>
                  </Suspense>
                )}
                <div className="absolute top-4 right-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {project.category}
                </div>
                <div className="absolute bottom-4 left-4 text-xs text-white/80 bg-black/50 px-2 py-1 rounded">
                  Click & drag to interact
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-foreground">{project.title}</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
