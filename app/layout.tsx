import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CookieConsent } from "@/components/cookie-consent"
import { NotificationSystem } from "@/components/notification-system"
import "./globals.css"

import { Oxanium as V0_Font_Oxanium, Source_Code_Pro as V0_Font_Source_Code_Pro, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _oxanium = V0_Font_Oxanium({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800"], variable: '--v0-font-oxanium' })
const _sourceCodePro = V0_Font_Source_Code_Pro({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"], variable: '--v0-font-source-code-pro' })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"], variable: '--v0-font-source-serif-4' })
const _v0_fontVariables = `${_oxanium.variable} ${_sourceCodePro.variable} ${_sourceSerif_4.variable}`

export const metadata: Metadata = {
  title: "Coconutz - Elite Game Development Studio | Roblox, Unity, Scratch Games",
  description:
    "Elite Roblox/Scratch/Unity game development studio creating innovative games and having fun. Professional game development services with creative flair.",
  generator: "v0.app",
  keywords: ["game development", "Roblox", "Unity", "Scratch", "game studio", "indie games", "game design"],
  authors: [{ name: "Coconutz Studio" }],
  creator: "Coconutz Studio",
  publisher: "Coconutz Studio",
  robots: "index, follow",
  openGraph: {
    title: "Coconutz - Elite Game Development Studio",
    description: "Elite Roblox/Scratch/Unity game development studio creating innovative games and having fun.",
    type: "website",
    locale: "en_US",
    siteName: "Coconutz Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coconutz - Elite Game Development Studio",
    description: "Elite Roblox/Scratch/Unity game development studio creating innovative games and having fun.",
  },
  verification: {
    google: "your-google-verification-code-here",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-2702715684817583" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="canonical" href="https://coconutz.studio" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white min-h-screen ${_v0_fontVariables}`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <CookieConsent />
        <NotificationSystem />
        <Analytics />
      </body>
    </html>
  )
}
