import type { Metadata } from "next"
import fonts from "./fonts.json"
import "./fonts.css"
import "./globals.css"
import { Navbar } from "../components/navbar"
import { SITE_URL } from "@/lib/utils"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ayush Gupta",
    template: "%s | Ayush Gupta",
  },
  description: "Software engineer working on backend, databases, and system architecture.",
  openGraph: {
    title: "Ayush Gupta",
    description: "Software engineer working on backend, databases, and system architecture.",
    url: "/",
    siteName: "Ayush Gupta",
    locale: "en_US",
    type: "website",
    images: ["/og/home"],
  },
  robots: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
  twitter: {
    title: "Ayush Gupta",
    card: "summary_large_image",
    creator: "@siAyushh",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href={fonts.core.url}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased min-h-screen font-mono">
        <div className="max-w-[42rem] mx-auto px-5 sm:px-4 py-8">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  )
}
