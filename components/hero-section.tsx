"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"

interface HeroSectionProps {
  onScrollToSection: (sectionId: string) => void
}

export function HeroSection({ onScrollToSection }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section id="home" className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div
        className={`transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 mb-6 text-balance animate-pulse">
          Coconutz
        </h1>

        <p className="text-white text-lg md:text-xl max-w-2xl mb-12 leading-relaxed text-pretty">
          Elite Roblox/Scratch/Unity game development studio chilling and having fun messing around with stuff :)
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => onScrollToSection("games")}
            className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white border-0 rounded-full px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Explore Our Games
          </Button>

          <Button
            variant="outline"
            className="border-2 border-teal-400 text-teal-300 hover:bg-teal-400 hover:text-black rounded-full px-8 py-3 text-lg bg-transparent font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <Link href="/editor">Check out our beta platform!</Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => onScrollToSection("games")}
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Scroll to games section"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m0 0l7-7" />
          </svg>
        </button>
      </div>
    </section>
  )
}
