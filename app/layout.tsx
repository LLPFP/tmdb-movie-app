import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MoviesProvider } from "@/contexts/movies-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TMDB Movies App",
  description: "Aplicación de películas y series usando TMDB API",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <MoviesProvider>{children}</MoviesProvider>
      </body>
    </html>
  )
}
