"use client"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { GamesSection } from "@/components/games-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen">
      <Header onScrollToSection={scrollToSection} />

      <main className="pt-20">
        <HeroSection onScrollToSection={scrollToSection} />
        <GamesSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            &copy; 2025 Coconutz. All rights confused, All lefts reserved. | Roblox Game Development Studio
          </p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  )
}
