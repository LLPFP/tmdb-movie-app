"use client";

import { useState, useEffect } from "react";

export default function AccessPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [step, setStep] = useState<"start" | "waiting" | "done">("start");

  const apiToken = process.env.NEXT_PUBLIC_TMDB_TOKEN;

  // Detecta si el usuario vuelve de TMDB y hay un request_token pendiente
  useEffect(() => {
    const requestToken = localStorage.getItem("tmdb_request_token");
    if (requestToken && !localStorage.getItem("tmdb_access_token")) {
      createAccessToken(requestToken);
    }
  }, []);

  // Paso 1: Solicitar request_token y redirigir a TMDB
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://api.themoviedb.org/4/auth/request_token",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!data.success || !data.request_token)
        throw new Error("No se pudo obtener el request_token");
      localStorage.setItem("tmdb_request_token", data.request_token);
      setStep("waiting");
      // Abre la aprobación de TMDB en una nueva pestaña (_blank)
      window.open(
        `https://www.themoviedb.org/auth/access?request_token=${data.request_token}`,
        "_blank"
      );
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      setLoading(false);
    }
  };

  // Paso 2: Crear access_token automáticamente al volver
  const createAccessToken = async (requestToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://api.themoviedb.org/4/auth/access_token",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ request_token: requestToken }),
        }
      );
      const data = await res.json();
      if (!data.success || !data.access_token)
        throw new Error("No se pudo crear el access_token");
      setAccessToken(data.access_token);
      localStorage.setItem("tmdb_access_token", data.access_token);
      setStep("done");
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        {!accessToken && (
          <button
            onClick={handleLogin}
            disabled={loading || step === "waiting"}
            className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
              loading || step === "waiting"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}>
            {loading ? "Cargando..." : "Iniciar sesión con TMDB"}
          </button>
        )}
        {accessToken && (
          <div className="text-green-600 font-bold text-center mt-4">
            ¡Access token creado!
          </div>
        )}
        {error && <div className="text-red-600 text-center mt-4">{error}</div>}
      </div>
    </div>
  );
}
