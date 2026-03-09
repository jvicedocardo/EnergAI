// src/app/error.tsx
"use client"; // Error boundaries MUST be Client Components

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void; // Función mágica de Next.js para reintentar renderizar
}) {
  useEffect(() => {
    // Aquí podrías enviar el error a un servicio como Sentry
    console.error("Error global atrapado por Next.js:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-red-100 max-w-md w-full">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          ¡Ups! Algo salió mal.
        </h2>
        <p className="text-gray-500 mb-8 text-sm">
          No hemos podido cargar esta página. Puede ser un problema temporal de
          conexión.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm"
          >
            Reintentar
          </button>

          <Link
            href="/"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors border border-gray-300"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
