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
        <MoviesProvider>
          <nav className="flex justify-center mb-8 bg-gray-100 py-4 shadow-md rounded-lg mx-4">
            <a
              href="/"
              className="mr-6 px-4 py-2 text-blue-700 font-semibold hover:underline hover:text-blue-900 transition-colors duration-200 rounded"
            >
              Inicio
            </a>
            <a
              href="/perfil"
              className="mr-6 px-4 py-2 text-blue-700 font-semibold hover:underline hover:text-blue-900 transition-colors duration-200 rounded"
            >
              Perfil
            </a>
            <a
              href="/login"
              className="px-4 py-2 text-blue-700 font-semibold hover:underline hover:text-blue-900 transition-colors duration-200 rounded"
            >
              Login
            </a>
          </nav>
          {children}
        </MoviesProvider>
      </body>
    </html>
  )
}
