"use client"

import { useState, useEffect } from "react"
import { Button } from "./button"
import { Menu, X, Server, Users, Briefcase, Mail, Home } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileMenuProps {
  className?: string
}

export function MobileMenu({ className }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: "Home", href: "#home" },
    { icon: <Users className="w-5 h-5" />, label: "About", href: "#about" },
    { icon: <Server className="w-5 h-5" />, label: "Services", href: "#services" },
    { icon: <Briefcase className="w-5 h-5" />, label: "Portfolio", href: "#portfolio" },
    { icon: <Mail className="w-5 h-5" />, label: "Contact", href: "#contact" },
  ]

  const handleMenuClick = (href: string) => {
    setIsOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isOpen && !target.closest(".mobile-menu")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isOpen])

  return (
    <div className={`mobile-menu md:hidden ${className}`}>
      {/* Menu Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90 transition-all duration-300 shadow-lg"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 max-w-[80vw] bg-background/95 backdrop-blur-md border-r border-border/50 z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-border/50">
                  <h2 className="text-xl font-bold text-foreground">Navigation</h2>
                  <p className="text-sm text-muted-foreground mt-1">Server Infrastructure Specialists</p>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-6">
                  <ul className="space-y-4">
                    {menuItems.map((item, index) => (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                      >
                        <button
                          onClick={() => handleMenuClick(item.href)}
                          className="flex items-center w-full p-4 rounded-lg hover:bg-accent/50 transition-colors duration-200 group"
                        >
                          <div className="text-primary group-hover:scale-110 transition-transform duration-200">
                            {item.icon}
                          </div>
                          <span className="ml-4 text-foreground font-medium">{item.label}</span>
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center">© 2024 Server Infrastructure Specialists</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
