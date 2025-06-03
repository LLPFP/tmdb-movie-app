"use client"

import { useEffect } from "react"
import { useMovies } from "@/contexts/movies-context"
import SearchBar from "@/components/search-bar"
import MovieCard from "@/components/movie-card"

const TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN
const BASE_URL = "https://api.themoviedb.org/3"

export default function HomePage() {
  const { movies, loading, error, setMovies, setLoading, setError } = useMovies()

  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${BASE_URL}/trending/all/week`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar películas populares")
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

    fetchPopularMovies()
  }, [setMovies, setLoading, setError])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Películas y Series</h1>

        <SearchBar />

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2">Cargando...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {!loading && movies.length === 0 && !error && (
          <p className="text-center text-gray-500 py-8">No se encontraron resultados</p>
        )}
      </div>
    </div>
  )
}
