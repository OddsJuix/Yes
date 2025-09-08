"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { ContactForm } from "@/components/contact-form"

export default function GTAGJKWKZPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 relative bg-black/20 backdrop-blur-sm">
        <div className="text-white font-semibold text-lg">GTAG JKWKZ</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button onClick={() => scrollToSection("home")} className="text-gray-200 hover:text-white transition-colors">
            Home
          </button>
          <button onClick={() => scrollToSection("about")} className="text-gray-200 hover:text-white transition-colors">
            About
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-gray-200 hover:text-white transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex flex-col space-y-1 z-50" onClick={toggleMenu}>
          <span
            className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
          ></span>
          <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
          <span
            className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          ></span>
        </button>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-sm md:hidden z-40">
            <div className="flex flex-col space-y-4 p-6">
              <button
                onClick={() => scrollToSection("home")}
                className="text-gray-200 hover:text-white transition-colors text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-200 hover:text-white transition-colors text-left"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-200 hover:text-white transition-colors text-left"
              >
                Contact
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="flex items-center gap-4 mb-6">
          <img src="/placeholder.svg?height=60&width=60" alt="GTAG Icon" className="h-15 w-15" />
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
            GTAG JKWKZ
          </h1>
        </div>

        <p className="text-gray-200 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          The ultimate funky GTAG experience. Swing, jump, and monke around!
        </p>

        <Link href="/">
          <Button className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white border-0 rounded-full px-8 py-3 text-lg">
            Back to Main Page
          </Button>
        </Link>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 md:px-12 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">About GTAG JKWKZ</h2>
          <p className="text-gray-200 text-lg leading-relaxed">GTAG JKWKZ is a Gorilla Tag dance group because yes</p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Get In Touch</h2>
          <p className="text-gray-200 text-lg mb-12">Questions or epic GTAG ideas? Hit us up!</p>

          <div className="mb-12">
            <ContactForm page="GTAG JKWKZ" />
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://discord.gg/bMaCmXyYXM"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white px-6 py-3 rounded-full transition-all"
            >
              Discord
            </a>
            <a
              href="mailto:support@coconutz.site"
              className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white px-6 py-3 rounded-full transition-all"
            >
              Email
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">&copy; 2025 Coconutz | GTAG JKWKZ. All rights confused, all lefts reserved.</p>
        </div>
      </footer>
    </div>
  )
}
