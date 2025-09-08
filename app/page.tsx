"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { ContactForm } from "@/components/contact-form"

export default function Home() {
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 relative bg-black/20 backdrop-blur-sm">
        <div className="text-white font-semibold text-lg">Coconutz</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button onClick={() => scrollToSection("home")} className="text-gray-100 hover:text-white transition-colors">
            Home
          </button>
          <button onClick={() => scrollToSection("games")} className="text-gray-100 hover:text-white transition-colors">
            Games
          </button>
          <button onClick={() => scrollToSection("about")} className="text-gray-100 hover:text-white transition-colors">
            About
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-gray-100 hover:text-white transition-colors"
          >
            Contact
          </button>
          <Link
            href="/jkwkz"
            className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white border-0 rounded-full px-4 py-2 text-sm transition-all"
          >
            Visit GTAG-JKWKZ
          </Link>
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
                className="text-gray-100 hover:text-white transition-colors text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("games")}
                className="text-gray-100 hover:text-white transition-colors text-left"
              >
                Games
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-100 hover:text-white transition-colors text-left"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-100 hover:text-white transition-colors text-left"
              >
                Contact
              </button>
              <Link href="/jkwkz" className="text-pink-400 hover:text-pink-300 transition-colors text-left">
                Visit GTAG-JKWKZ
              </Link>
            </div>
          </nav>
        )}

        <Button className="hidden md:block bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white border-0 rounded-full px-6">
          <a href="https://discord.gg/9EHCZKzJpx" target="_blank" rel="noopener noreferrer">
            Visit Our Discord
          </a>
        </Button>
      </header>

      {/* Hero Section */}
      <section id="home" className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 mb-6">
          Coconutz
        </h1>

        <p className="text-white text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          Elite Roblox/Scratch/Unity game development studio chilling and having fun messing around with stuff :)
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => scrollToSection("games")}
            className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white border-0 rounded-full px-8 py-3 text-lg font-semibold"
          >
            Explore Our Games
          </Button>

          <Button
            variant="outline"
            className="border-2 border-teal-400 text-teal-300 hover:bg-teal-400 hover:text-black rounded-full px-8 py-3 text-lg bg-transparent font-semibold"
          >
            <Link href="/editor">Check out our beta platform!</Link>
          </Button>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">Our Games</h2>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">Idk</div>
              <div className="text-gray-100">Total Visits</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">2+</div>
              <div className="text-gray-100">Games Published</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">2+</div>
              <div className="text-gray-100">Active Players</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">3.6★</div>
              <div className="text-gray-100">Average Rating</div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <img
                src="/placeholder.svg?height=200&width=400"
                alt="Army of Hats"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Army of Hats</h3>
                <p className="text-gray-100">
                  Army of Hats.. nothing much to explain.. besides you kill an army of hats!
                </p>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <img
                src="/placeholder.svg?height=200&width=400"
                alt="Punch or Perish"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">Punch or Perish</h3>
                <p className="text-gray-100">Coming out in January of 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 md:px-12 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">About Coconutz</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-100 text-lg leading-relaxed">
                We create fun, innovative games using Roblox, Scratch, and Unity. Our team loves experimenting and
                pushing the limits of creativity.
              </p>
            </div>
            <div className="text-center">
              <img src="/placeholder.svg?height=300&width=400" alt="Development Team" className="rounded-lg mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Get In Touch</h2>
          <p className="text-gray-100 text-lg mb-12">
            Ready to collaborate or got a wild project idea? Hit us up — let's build something insane together.
          </p>

          <div className="mb-12">
            <ContactForm page="Coconutz Main" />
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://discord.gg/9EHCZKzJpx"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white px-6 py-3 rounded-full transition-all"
            >
              Discord
            </a>
            <a
              href="https://twitter.com/OddsJuix"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white px-6 py-3 rounded-full transition-all"
            >
              Twitter
            </a>
            <a
              href="mailto:support@coconutz.site"
              className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white px-6 py-3 rounded-full transition-all"
            >
              Email
            </a>
            <Link
              href="/jkwkz"
              className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white px-6 py-3 rounded-full transition-all"
            >
              GTAG-JKWKZ Page
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            &copy; 2025 Coconutz. All rights confused, All lefts reserved. | Roblox Game Development Studio
          </p>
        </div>
      </footer>
    </div>
  )
}
