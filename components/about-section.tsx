"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const teamFeatures = [
  {
    title: "Multi-Platform Expertise",
    description:
      "We develop games across Roblox, Scratch, and Unity platforms, bringing diverse experiences to every project.",
  },
  {
    title: "Creative Innovation",
    description:
      "Our team loves experimenting with new ideas and pushing the boundaries of what's possible in game development.",
  },
  {
    title: "Community-Driven",
    description:
      "We build games with our community in mind, always listening to feedback and incorporating player suggestions.",
  },
]

const technologies = [
  { name: "Roblox Studio", color: "from-red-500 to-red-600" },
  { name: "Unity", color: "from-gray-600 to-gray-700" },
  { name: "Scratch", color: "from-orange-500 to-orange-600" },
  { name: "Lua", color: "from-blue-500 to-blue-600" },
  { name: "C#", color: "from-purple-500 to-purple-600" },
  { name: "JavaScript", color: "from-yellow-500 to-yellow-600" },
]

export function AboutSection() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  return (
    <section id="about" className="py-20 px-6 md:px-12 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-12 text-balance">About Coconutz</h2>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="text-gray-100 text-lg leading-relaxed mb-8 text-pretty">
              We create fun, innovative games using Roblox, Scratch, and Unity. Our team loves experimenting and pushing
              the limits of creativity. From action-packed adventures to mind-bending puzzles, we craft experiences that
              bring joy to players worldwide.
            </p>

            <div className="space-y-4">
              {teamFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? "bg-teal-400/20 border-l-4 border-teal-400"
                      : "bg-gray-800/30 hover:bg-gray-800/50"
                  }`}
                  onClick={() => setActiveFeature(activeFeature === index ? null : index)}
                >
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  {activeFeature === index && <p className="text-gray-300 text-sm">{feature.description}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="relative">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Development Team"
                className="rounded-lg mx-auto shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent rounded-lg"></div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Our Tech Stack</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${tech.color} hover:scale-105 transition-transform duration-200`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center bg-gray-800/30 rounded-lg p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
          <p className="text-gray-100 text-lg max-w-3xl mx-auto leading-relaxed text-pretty">
            To create unforgettable gaming experiences that bring people together, spark creativity, and push the
            boundaries of what's possible in game development. We believe games should be fun, accessible, and
            meaningful to everyone who plays them.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white rounded-full px-8 py-3">
              Join Our Community
            </Button>
            <Button
              variant="outline"
              className="border-2 border-teal-400 text-teal-300 hover:bg-teal-400 hover:text-black rounded-full px-8 py-3 bg-transparent"
            >
              View Our Work
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
