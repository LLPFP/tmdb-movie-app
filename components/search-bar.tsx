"use client"

import type React from "react"

import { useState } from "react"
import { useMovies } from "@/contexts/movies-context"

const TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN
const BASE_URL = "https://api.themoviedb.org/3"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const { setMovies, setLoading, setError } = useMovies()

  const searchMovies = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${BASE_URL}/search/multi?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Error al buscar películas")
      }

      const data = await response.json()
      setMovies(data.results || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido")
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchMovies(query)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar películas y series..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Buscar
        </button>
      </div>
    </form>
  )
}
