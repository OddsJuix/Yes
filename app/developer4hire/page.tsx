"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Code, Gamepad2, Palette, Zap, Users, Trophy, Star } from "lucide-react"
import { ContactForm } from "@/components/contact-form"

export default function Developer4HirePage() {
  const services = [
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Game Development",
      description: "Custom Roblox, Unity, and Scratch games built to your specifications",
      features: [
        "Custom gameplay mechanics",
        "Professional UI/UX",
        "Multiplayer support",
        "Cross-platform compatibility",
      ],
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Web Development",
      description: "Modern websites and web applications using cutting-edge technologies",
      features: ["React/Next.js development", "Full-stack solutions", "Database integration", "Responsive design"],
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "UI/UX Design",
      description: "Beautiful, intuitive interfaces that users love to interact with",
      features: ["User interface design", "User experience optimization", "Prototyping", "Brand identity"],
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Automation & Tools",
      description: "Custom tools and automation solutions to streamline your workflow",
      features: ["Discord bots", "Workflow automation", "Custom scripts", "API integrations"],
    },
  ]

  const portfolio = [
    {
      title: "Army of Hats",
      type: "Roblox Game",
      description: "Action-packed multiplayer game with custom mechanics",
      rating: "4.2★",
      plays: "10K+",
    },
    {
      title: "Coconutz Video Editor",
      type: "Web Application",
      description: "Browser-based video editing platform with real-time effects",
      rating: "Beta",
      plays: "Active",
    },
    {
      title: "GTAG-JKWKZ Platform",
      type: "Web Platform",
      description: "Community platform with custom features and integrations",
      rating: "Live",
      plays: "Growing",
    },
  ]

  const testimonials = [
    {
      name: "Alex M.",
      project: "Custom Roblox Game",
      text: "The Coconutz team delivered exactly what I envisioned. Professional, creative, and on time!",
      rating: 5,
    },
    {
      name: "Sarah K.",
      project: "Website Development",
      text: "Amazing work on our company website. The design is modern and the functionality is perfect.",
      rating: 5,
    },
    {
      name: "Mike R.",
      project: "Discord Bot",
      text: "Custom Discord bot works flawlessly. Great communication throughout the project.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 bg-black/20 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-white font-semibold text-lg">Developer4Hire</div>
        </div>

        <Link href="/#contact">
          <Button className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white">
            Get Quote
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 mb-6">
            Hire Our Developers
          </h1>
          <p className="text-white text-xl md:text-2xl mb-8 leading-relaxed">
            Professional game development, web solutions, and custom software from the Coconutz team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white px-8 py-3 text-lg"
            >
              View Services
            </Button>
            <Button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              variant="outline"
              className="border-2 border-teal-400 text-teal-300 hover:bg-teal-400 hover:text-black px-8 py-3 text-lg bg-transparent"
            >
              Start Project
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-teal-400 mb-2">50+</div>
                <div className="text-gray-300">Projects Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-teal-400 mb-2">100%</div>
                <div className="text-gray-300">Client Satisfaction</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-teal-400 mb-2">24/7</div>
                <div className="text-gray-300">Support Available</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-teal-400 mb-2">2-4</div>
                <div className="text-gray-300">Week Delivery</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="text-teal-400">{service.icon}</div>
                    <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">Recent Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {portfolio.map((project, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 hover:transform hover:scale-105 transition-all"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                      <Badge variant="secondary" className="mt-2 bg-teal-500/20 text-teal-300">
                        {project.type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-semibold">{project.rating}</div>
                      <div className="text-gray-400 text-sm">{project.plays}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">What Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.project}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">1. Consultation</h3>
              <p className="text-gray-300">We discuss your project requirements and goals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">2. Design</h3>
              <p className="text-gray-300">Create mockups and prototypes for your approval</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">3. Development</h3>
              <p className="text-gray-300">Build your project with regular progress updates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">4. Delivery</h3>
              <p className="text-gray-300">Launch your project with ongoing support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to Start Your Project?</h2>
          <p className="text-gray-300 text-lg mb-12">
            Get a free consultation and quote for your next development project. We're here to bring your ideas to life.
          </p>

          <div className="mb-12">
            <ContactForm page="Developer4Hire" />
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
              href="mailto:support@coconutz.site"
              className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white px-6 py-3 rounded-full transition-all"
            >
              Email
            </a>
            <Link
              href="/"
              className="border-2 border-teal-400 text-teal-300 hover:bg-teal-400 hover:text-black px-6 py-3 rounded-full transition-all bg-transparent"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">&copy; 2025 Coconutz Developer4Hire. Professional development services.</p>
        </div>
      </footer>
    </div>
  )
}
