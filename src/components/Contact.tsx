"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
// import PlanetScene from "./3d/PlanetScene"  // Keeping for future reference
import ContactServerScene from "./3d/ContactServerScene"
import ParticleBackground from "./3d/ParticleBackground"
import Footer from "./Footer"

export default function Contact() {
  const [isClient, setIsClient] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isDark, setIsDark] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  useEffect(() => {
    setIsClient(true)
    
    // Initial theme detection
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)

    // Theme change observer
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isClient) return

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isClient])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Thank you for your message! Our server infrastructure team will get back to you within 24 hours.")
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <>
      <section id="contact" className="relative py-24 overflow-hidden">
        {/* Interactive Background */}
        <div className="absolute inset-0 z-0">
          {isClient && (
            <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10" />}>
              <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <ParticleBackground mousePosition={mousePosition} isDark={isDark} />
              </Canvas>
            </Suspense>
          )}
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl md:text-5xl xl:text-6xl font-bold text-foreground">Get in Touch with AK</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg xl:text-xl text-muted-foreground">
              Connect with Ethiopia's leading server infrastructure experts for international hardware solutions and professional configurations.
            </p>
          </div>

          <div className="grid gap-16 lg:grid-cols-2">
            {/* 3D Scene */}
            <div className="relative h-[600px] lg:h-[700px] rounded-lg overflow-hidden">
              {isClient && (
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm text-muted-foreground">Loading 3D Scene...</p>
                      </div>
                    </div>
                  }
                >
                  <Canvas
                    camera={{
                      position: [0, 0, 8],
                      fov: 45,
                      near: 0.1,
                      far: 1000
                    }}
                    className="h-full w-full"
                    shadows
                  >
                    {/* Original Planet Scene - Commented out for future reference
                    <PlanetScene scale={0.6} position={[0, -0.5, 0]} /> */}
                    
                    {/* New Server Scene */}
                    <ContactServerScene scale={0.8} position={[0, -1, 0]} />
                    <OrbitControls
                      enableZoom={false}
                      enablePan={false}
                      autoRotate={true}
                      autoRotateSpeed={1}
                      minPolarAngle={Math.PI / 3}
                      maxPolarAngle={Math.PI * 2/3}
                      minAzimuthAngle={-Math.PI / 4}
                      maxAzimuthAngle={Math.PI / 4}
                      rotateSpeed={0.5}
                    />
                    <Environment preset={isDark ? "night" : "sunset"} />
                  </Canvas>
                </Suspense>
              )}
              {/* 3D Interaction Hint */}
              <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-muted-foreground border shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Interactive 3D Server
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-background/50 backdrop-blur-sm p-8 border shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6">Request Server Consultation</h3>

              <div className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Company Name / Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-background/80 h-12"
                />

                <Input
                  type="email"
                  name="email"
                  placeholder="Business Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-background/80 h-12"
                />

                <Input
                  type="text"
                  name="subject"
                  placeholder="Subject (e.g., Server Export Quote, Configuration Services)"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="bg-background/80 h-12"
                />

                <Textarea
                  name="message"
                  placeholder="Tell us about your server requirements, export destination, or technical specifications..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="min-h-[150px] bg-background/80"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Submit Inquiry
              </Button>

              <div className="text-sm text-muted-foreground text-center space-y-2">
                <p className="font-medium">Direct Contact Options:</p>
                <p>Phone: +251 91 126 6369</p>
                <p>Telegram: @nixrun</p>
                <p>Based in Ethiopia • International Server Solutions</p>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
