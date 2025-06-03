"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

interface MoviesContextType {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <MoviesContext.Provider
      value={{
        movies,
        setMovies,
        loading,
        setLoading,
        error,
        setError,
      }}>
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MoviesContext);
  if (context === undefined) {
    throw new Error("useMovies must be used within a MoviesProvider");
  }
  return context;
}
