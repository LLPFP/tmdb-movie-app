import Link from "next/link"
import Image from "next/image"

interface Movie {
  id: number
  title?: string
  name?: string
  poster_path: string
  overview: string
  release_date?: string
  first_air_date?: string
  vote_average: number
  media_type?: string
}

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  const title = movie.title || movie.name || "Sin título"
  const releaseDate = movie.release_date || movie.first_air_date
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A"
  const mediaType = movie.media_type || (movie.title ? "movie" : "tv")

  return (
    <Link href={`/${mediaType}/${movie.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-64">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Sin imagen</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-2">Año: {year}</p>
          <p className="text-gray-700 text-sm line-clamp-3">{movie.overview}</p>
          <div className="mt-2 flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-sm">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
