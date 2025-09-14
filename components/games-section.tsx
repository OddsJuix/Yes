"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"

interface GameData {
  id: string
  title: string
  description: string
  image: string
  status: "released" | "coming-soon"
  releaseDate?: string
}

const games: GameData[] = [
  {
    id: "army-of-hats",
    title: "Army of Hats",
    description: "Army of Hats.. nothing much to explain.. besides you kill an army of hats!",
    image: "/placeholder.svg?height=200&width=400",
    status: "released",
  },
  {
    id: "punch-or-perish",
    title: "Punch or Perish",
    description: "Coming out in January of 2026",
    image: "/placeholder.svg?height=200&width=400",
    status: "coming-soon",
    releaseDate: "January 2026",
  },
]

const stats = [
  { value: "Idk", label: "Total Visits" },
  { value: "2+", label: "Games Published" },
  { value: "2+", label: "Active Players" },
  { value: "3.6★", label: "Average Rating" },
]

export function GamesSection() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("games")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const handleImageLoad = (gameId: string) => {
    setLoadingImages((prev) => ({ ...prev, [gameId]: false }))
  }

  const handleImageLoadStart = (gameId: string) => {
    setLoadingImages((prev) => ({ ...prev, [gameId]: true }))
  }

  return (
    <section id="games" className="py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-12 text-balance">Our Games</h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 ${
                  isVisible ? "animate-fade-in-up" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl font-bold text-teal-400 mb-2">{stat.value}</div>
                <div className="text-gray-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Games Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {games.map((game, index) => (
              <div
                key={game.id}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                  selectedGame === game.id ? "ring-2 ring-teal-400 scale-105" : "hover:scale-105"
                } ${isVisible ? "animate-fade-in-up" : ""}`}
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
                onClick={() => setSelectedGame(selectedGame === game.id ? null : game.id)}
              >
                <div className="relative">
                  {loadingImages[game.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <LoadingSpinner />
                    </div>
                  )}
                  <img
                    src={game.image || "/placeholder.svg"}
                    alt={game.title}
                    className="w-full h-48 object-cover"
                    onLoadStart={() => handleImageLoadStart(game.id)}
                    onLoad={() => handleImageLoad(game.id)}
                    loading="lazy"
                  />
                  {game.status === "coming-soon" && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                      Coming Soon
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{game.title}</h3>
                  <p className="text-gray-100 mb-4">{game.description}</p>

                  {selectedGame === game.id && (
                    <div className="mt-4 pt-4 border-t border-gray-700 animate-fade-in">
                      {game.status === "released" ? (
                        <Button className="w-full bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-500 hover:to-cyan-400 text-black font-semibold transition-all duration-300 hover:scale-105">
                          Play Now
                        </Button>
                      ) : (
                        <div className="text-center">
                          <p className="text-teal-300 font-semibold mb-2">Release Date: {game.releaseDate}</p>
                          <Button
                            variant="outline"
                            className="w-full border-teal-400 text-teal-300 hover:bg-teal-400 hover:text-black transition-all duration-300 hover:scale-105 bg-transparent"
                          >
                            Get Notified
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-gray-100 text-lg mb-6">Want to see more games? Follow our development journey!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white rounded-full px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <a href="https://discord.gg/9EHCZKzJpx" target="_blank" rel="noopener noreferrer">
                  Join Discord
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-2 border-teal-400 text-teal-300 hover:bg-teal-400 hover:text-black rounded-full px-8 py-3 bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                View All Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
