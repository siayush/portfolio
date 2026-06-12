import { MotionProvider } from "@/components/motion-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Inter as FontSans, Silkscreen, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Footer from "@/components/footer";
import NavBar from "@/components/navbar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontPixel = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pixel",
});

const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DATA.name,
    template: `%s | ${DATA.name}`,
  },
  description: DATA.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${DATA.name}`,
    description: DATA.description,
    url: SITE_URL,
    siteName: `${DATA.name}`,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen flex flex-col bg-background font-sans antialiased max-w-2xl mx-auto py-10 sm:py-20 px-6",
          fontSans.variable,
          fontPixel.variable,
          fontSerif.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MotionProvider>
            <NavBar />
            {children}
            <Footer />
            <Analytics />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
