"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

const TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN
const BASE_URL = "https://api.themoviedb.org/3"

interface TVDetails {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  first_air_date: string
  vote_average: number
  number_of_seasons: number
  number_of_episodes: number
  genres: { id: number; name: string }[]
}

export default function TVDetailPage() {
  const params = useParams()
  const [tv, setTV] = useState<TVDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTVDetails = async () => {
      if (!params.id) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${BASE_URL}/tv/${params.id}?language=es-ES`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar detalles de la serie")
        }

        const data = await response.json()
        setTV(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchTVDetails()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error || !tv) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Serie no encontrada"}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-64 md:h-96">
        {tv.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
            alt={tv.name}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver al inicio
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              {tv.poster_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                  alt={tv.name}
                  width={500}
                  height={750}
                  className="w-full h-auto"
                />
              )}
            </div>
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold mb-4">{tv.name}</h1>

              <div className="mb-4">
                <span className="text-yellow-500 text-xl">★</span>
                <span className="ml-1 text-lg">{tv.vote_average.toFixed(1)}/10</span>
              </div>

              <div className="mb-4">
                <p>
                  <strong>Primera emisión:</strong> {new Date(tv.first_air_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Temporadas:</strong> {tv.number_of_seasons}
                </p>
                <p>
                  <strong>Episodios:</strong> {tv.number_of_episodes}
                </p>
              </div>

              <div className="mb-4">
                <strong>Géneros:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tv.genres.map((genre) => (
                    <span key={genre.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Sinopsis</h2>
                <p className="text-gray-700 leading-relaxed">{tv.overview}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
