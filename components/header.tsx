"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"

interface HeaderProps {
  onScrollToSection: (sectionId: string) => void
}

export function Header({ onScrollToSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleScrollToSection = (sectionId: string) => {
    onScrollToSection(sectionId)
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setScrolled(scrollPosition > 50)

      // Update active section based on scroll position
      const sections = ["home", "games", "about", "contact"]
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

  const navItems = [
    { id: "home", label: "Home" },
    { id: "games", label: "Games" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 transition-all duration-300 ${
        scrolled ? "bg-gray-900/95 backdrop-blur-md shadow-lg" : "bg-black/20 backdrop-blur-sm"
      }`}
    >
      <div
        className="text-white font-semibold text-lg hover:text-teal-400 transition-colors cursor-pointer"
        onClick={() => handleScrollToSection("home")}
      >
        Coconutz
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleScrollToSection(item.id)}
            className={`transition-colors relative ${
              activeSection === item.id ? "text-teal-400" : "text-gray-100 hover:text-white"
            }`}
          >
            {item.label}
            {activeSection === item.id && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-400 rounded-full"></div>
            )}
          </button>
        ))}
        <Link href="/developer4hire" className="text-gray-100 hover:text-white transition-colors">
          Hire Us
        </Link>
        <Link
          href="/jkwkz"
          className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white border-0 rounded-full px-4 py-2 text-sm transition-all hover:scale-105"
        >
          Visit GTAG-JKWKZ
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button className="md:hidden flex flex-col space-y-1 z-50" onClick={toggleMenu}>
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
        ></span>
        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
        ></span>
      </button>

      {/* Mobile Navigation */}
      <div
        className={`absolute top-full left-0 right-0 md:hidden transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <nav className="bg-gray-900/95 backdrop-blur-md shadow-lg">
          <div className="flex flex-col space-y-4 p-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScrollToSection(item.id)}
                className={`text-left transition-colors ${
                  activeSection === item.id ? "text-teal-400" : "text-gray-100 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <Link href="/developer4hire" className="text-gray-100 hover:text-white transition-colors text-left">
              Hire Us
            </Link>
            <Link href="/jkwkz" className="text-pink-400 hover:text-pink-300 transition-colors text-left">
              Visit GTAG-JKWKZ
            </Link>
          </div>
        </nav>
      </div>

      <Button className="hidden md:block bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white border-0 rounded-full px-6 hover:scale-105 transition-all">
        <a href="https://discord.gg/9EHCZKzJpx" target="_blank" rel="noopener noreferrer">
          Visit Our Discord
        </a>
      </Button>
    </header>
  )
}
