"use client"

import { useState, useEffect } from "react"
import { Button } from "./button"
import { Moon, Sun, Menu, X, Server, Users, Briefcase, Mail, Home, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface HeaderProps {
  isDark: boolean
  onToggleTheme: () => void
}

export function Header({ isDark, onToggleTheme }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const navigationItems = [
    { id: "home", label: "Home", icon: <Home className="w-4 h-4" />, href: "#home" },
    { id: "about", label: "About", icon: <Users className="w-4 h-4" />, href: "#about" },
    { id: "services", label: "Services", icon: <Settings className="w-4 h-4" />, href: "#services" },
    { id: "portfolio", label: "Portfolio", icon: <Briefcase className="w-4 h-4" />, href: "#portfolio" },
    // { id: "contact", label: "Contact", icon: <Mail className="w-4 h-4" />, href: "#contact" },
  ]

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)

      // Update active section based on scroll position
      const sections = navigationItems.map((item) => item.id)
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle navigation clicks
  const handleNavClick = (href: string, id: string) => {
    setActiveSection(id)
    setIsMobileMenuOpen(false)

    const element = document.querySelector(href)
    if (element) {
      const headerHeight = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isMobileMenuOpen && !target.closest(".mobile-nav")) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isMobileMenuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center space-x-3"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Server className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground">ServerPro</h1>
                <p className="text-xs text-muted-foreground">Infrastructure Specialists</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => handleNavClick(item.href, item.id)}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-accent/50 ${
                      activeSection === item.id
                        ? "text-primary bg-accent/30"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleTheme}
                  className="relative w-9 h-9 hover:bg-accent/50 transition-all duration-300"
                >
                  <Sun
                    className={`h-4 w-4 transition-all duration-500 ${
                      isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100"
                    }`}
                  />
                  <Moon
                    className={`absolute h-4 w-4 transition-all duration-500 ${
                      isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"
                    }`}
                  />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </motion.div>

              {/* CTA Button - Desktop */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="hidden md:block"
              >
                <Button
                  onClick={() => handleNavClick("#contact", "contact")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Get Quote
                </Button>
              </motion.div>

              {/* Mobile Menu Toggle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="lg:hidden mobile-nav"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-9 h-9 hover:bg-accent/50 transition-all duration-300"
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
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
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mobile-nav fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur-md border-l border-border/50 z-50 shadow-2xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                      <Server className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">ServerPro</h2>
                      <p className="text-xs text-muted-foreground">Infrastructure Specialists</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation Items */}
                <nav className="flex-1 p-6">
                  <ul className="space-y-2">
                    {navigationItems.map((item, index) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                      >
                        <button
                          onClick={() => handleNavClick(item.href, item.id)}
                          className={`flex items-center w-full p-4 rounded-lg transition-all duration-200 group ${
                            activeSection === item.id
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "hover:bg-accent/50 text-foreground"
                          }`}
                        >
                          <div
                            className={`transition-transform duration-200 ${
                              activeSection === item.id
                                ? "text-primary scale-110"
                                : "text-muted-foreground group-hover:scale-110 group-hover:text-primary"
                            }`}
                          >
                            {item.icon}
                          </div>
                          <span className="ml-4 font-medium">{item.label}</span>
                          {activeSection === item.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto w-2 h-2 bg-primary rounded-full"
                            />
                          )}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Mobile CTA */}
                <div className="p-6 border-t border-border/50">
                  <Button
                    onClick={() => handleNavClick("#contact", "contact")}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Get Free Quote
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    © 2024 ServerPro Infrastructure Specialists
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
