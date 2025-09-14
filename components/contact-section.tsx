"use client"

import { ContactForm } from "@/components/contact-form"
import Link from "next/link"
import { useState } from "react"

const socialLinks = [
  {
    name: "Discord",
    href: "https://discord.gg/9EHCZKzJpx",
    description: "Join our community",
    icon: "💬",
    external: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/OddsJuix",
    description: "Follow updates",
    icon: "🐦",
    external: true,
  },
  {
    name: "Email",
    href: "mailto:support@coconutz.site",
    description: "Direct contact",
    icon: "📧",
    external: false,
  },
  {
    name: "GTAG-JKWKZ Page",
    href: "/jkwkz",
    description: "Special project",
    icon: "🎮",
    external: false,
  },
  {
    name: "Hire Our Team",
    href: "/developer4hire",
    description: "Professional services",
    icon: "💼",
    external: false,
    variant: "outline",
  },
]

export function ContactSection() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  return (
    <section id="contact" className="py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-balance">Get In Touch</h2>
        <p className="text-gray-100 text-lg mb-12 text-pretty">
          Ready to collaborate or got a wild project idea? Hit us up — let's build something insane together.
        </p>

        {/* Contact Form */}
        <div className="mb-16 bg-gray-800/30 rounded-lg p-8 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-6">Send us a message</h3>
          <ContactForm page="Coconutz Main" />
        </div>

        {/* Social Links Grid */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-white mb-8">Connect with us</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialLinks.map((link) => {
              const LinkComponent = link.external ? "a" : Link
              const linkProps = link.external
                ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
                : { href: link.href }

              return (
                <LinkComponent
                  key={link.name}
                  {...linkProps}
                  className={`group p-4 rounded-lg transition-all duration-300 ${
                    link.variant === "outline"
                      ? "border-2 border-teal-400 text-teal-300 hover:bg-teal-400 hover:text-black bg-transparent"
                      : "bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white"
                  } ${hoveredLink === link.name ? "scale-105" : ""}`}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-xl">{link.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold">{link.name}</div>
                      <div
                        className={`text-sm ${
                          link.variant === "outline" ? "text-teal-300 group-hover:text-black" : "text-white/80"
                        }`}
                      >
                        {link.description}
                      </div>
                    </div>
                  </div>
                </LinkComponent>
              )
            })}
          </div>
        </div>

        {/* Quick Contact Info */}
        <div className="bg-gray-800/30 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Info</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-teal-400 font-semibold mb-1">Response Time</div>
              <div className="text-gray-300">Usually within 24 hours</div>
            </div>
            <div>
              <div className="text-teal-400 font-semibold mb-1">Best Contact</div>
              <div className="text-gray-300">Discord for quick chat</div>
            </div>
            <div>
              <div className="text-teal-400 font-semibold mb-1">Time Zone</div>
              <div className="text-gray-300">Available globally</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
