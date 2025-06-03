"use client";

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [movieId, setMovieId] = useState("");
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [accountObjectId, setAccountObjectId] = useState<string | null>(null);

  // Nuevo estado para controlar la lista expandida y sus películas
  const [expandedListId, setExpandedListId] = useState<string | null>(null);
  const [expandedListMovies, setExpandedListMovies] = useState<any[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("tmdb_access_token")
      : null;

  const fetchAccountObjectId = async () => {
    const fixedId = "683e0247f1dc67277bfdb822";
    setAccountObjectId(fixedId);
    return fixedId;
  };

  const fetchLists = async (objectId?: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!accessToken) throw new Error("No hay access_token");
      const id = objectId || accountObjectId;
      if (!id) throw new Error("No hay account_object_id");
      const res = await fetch(
        `https://api.themoviedb.org/4/account/${id}/lists?page=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setLists(data.results || []);
    } catch (err: any) {
      setError(err.message || "Error al obtener listas");
    } finally {
      setLoading(false);
    }
  };

  const fetchListMovies = async (listId: string) => {
    setLoadingMovies(true);
    setError(null);
    try {
      if (!accessToken) throw new Error("No hay access_token");
      const res = await fetch(`https://api.themoviedb.org/3/list/${listId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // Cambia 'results' por 'items'
      setExpandedListMovies(data.items || []);
    } catch (err: any) {
      setError(err.message || "Error al obtener películas de la lista");
      setExpandedListMovies([]);
    } finally {
      setLoadingMovies(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchAccountObjectId().then((id) => {
        if (id) fetchLists(id);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // Crear una lista nueva
  const createList = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!accessToken) throw new Error("No hay access_token");
      const res = await fetch("https://api.themoviedb.org/4/list", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newListName,
          iso_639_1: "es",
          description: newListDesc,
          public: true,
        }),
      });
      const data = await res.json();
      if (!data.id) throw new Error("No se pudo crear la lista");
      setNewListName("");
      setNewListDesc("");
      if (accountObjectId) fetchLists(accountObjectId);
    } catch (err: any) {
      setError(err.message || "Error al crear lista");
    } finally {
      setLoading(false);
    }
  };

  // Añadir película a una lista
  const addMovieToList = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!accessToken) throw new Error("No hay access_token");
      if (!selectedList) throw new Error("Selecciona una lista");
      const res = await fetch(
        `https://api.themoviedb.org/4/list/${selectedList}/items`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              {
                media_type: "movie",
                media_id: Number(movieId),
              },
            ],
          }),
        }
      );
      const data = await res.json();
      if (!data.status_code || data.status_code !== 1)
        throw new Error("No se pudo añadir la película");
      setMovieId("");
      alert("¡Película añadida!");
      // Si la lista expandida es la misma, recarga sus películas
      if (expandedListId === selectedList) {
        fetchListMovies(selectedList);
      }
    } catch (err: any) {
      setError(err.message || "Error al añadir película");
    } finally {
      setLoading(false);
    }
  };

  // Manejar click en una lista para expandir/cerrar y cargar películas
  const handleExpandList = (listId: string) => {
    if (expandedListId === listId) {
      setExpandedListId(null);
      setExpandedListMovies([]);
    } else {
      setExpandedListId(listId);
      fetchListMovies(listId);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Tus listas</h2>
        {loading && <div>Cargando...</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="grid gap-4 mb-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    className="font-semibold underline text-blue-700 text-lg"
                    onClick={() => handleExpandList(list.id)}
                    type="button">
                    {list.name}
                  </button>
                  <div className="text-gray-600 text-sm">
                    {list.description}
                  </div>
                </div>
              </div>
              {expandedListId === list.id && (
                <div className="mt-2 bg-gray-50 p-2 rounded">
                  {loadingMovies ? (
                    <div>Cargando películas...</div>
                  ) : expandedListMovies.length === 0 ? (
                    <div>No hay películas en esta lista.</div>
                  ) : (
                    <ul>
                      {expandedListMovies.map((movie: any) => (
                        <li key={movie.id} className="mb-1">
                          {movie.title || movie.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Crear nueva lista</h3>
          <input
            className="border px-2 py-1 mr-2 mb-2"
            placeholder="Nombre"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <input
            className="border px-2 py-1 mr-2 mb-2"
            placeholder="Descripción"
            value={newListDesc}
            onChange={(e) => setNewListDesc(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={createList}
            disabled={loading || !newListName}>
            Crear lista
          </button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Añadir película a una lista</h3>
          <select
            className="border px-2 py-1 mr-2 mb-2"
            value={selectedList || ""}
            onChange={(e) => setSelectedList(e.target.value)}>
            <option value="">Selecciona una lista</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
          <input
            className="border px-2 py-1 mr-2 mb-2"
            placeholder="ID de película (ej: 550)"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            type="number"
          />
          <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={addMovieToList}
            disabled={loading || !selectedList || !movieId}>
            Añadir película
          </button>
        </div>
      </div>
    </div>
  );
}
