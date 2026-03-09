"use client";

import { useActionState, useEffect } from "react";
import { analyzeInvoice } from "../app/actions";
import { toast } from "sonner";

export default function UploadForm() {
  const [state, formAction, isPending] = useActionState(analyzeInvoice, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error); // Toast rojo de error
    } else if (state?.success) {
      toast.success("¡Factura analizada y guardada con éxito!"); // Toast verde de éxito
    }
  }, [state]);

  return (
    <div className="w-full space-y-4">
      <form action={formAction} className="flex flex-col space-y-4 text-left">
        {/* NUEVO: Selector de Modelo de IA */}
        <div className="space-y-1">
          <label
            htmlFor="aiModel"
            className="block text-sm font-medium text-gray-700"
          >
            Modelo de Inteligencia Artificial:
          </label>
          <select
            id="aiModel"
            name="aiModel"
            defaultValue="gemini-2.5-flash" // Ponemos la 2.5 por defecto al ser muy estable
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
          >
            <option value="gemini-3-flash-preview">
              Gemini 3 Flash (Preview - Novedad)
            </option>
            <option value="gemini-2.5-flash">
              Gemini 2.5 Flash (Recomendado - Estable)
            </option>
            <option value="gemini-2.0-flash">
              Gemini 2.0 Flash (Legacy - Rápido)
            </option>
          </select>
        </div>

        {/* Input de archivo */}
        <div className="space-y-1">
          <label
            htmlFor="invoiceFile"
            className="block text-sm font-medium text-gray-700"
          >
            Archivo de Factura (PDF/Imagen):
          </label>
          <input
            type="file"
            id="invoiceFile"
            name="invoiceFile"
            accept=".pdf,image/png,image/jpeg"
            required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-200 rounded-md p-1"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-sm cursor-pointer mt-2"
        >
          {isPending ? (
            <>
              {/* Spinner animado SVG */}
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Analizando con Inteligencia Artificial...
            </>
          ) : (
            "Subir y Analizar"
          )}
        </button>
      </form>

      {state?.success && state.data && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-900 mt-6">
          <p className="font-bold">✅ Detectado: {state.data.tipo}</p>
          <p>
            {state.data.empresa} - {state.data.total_factura} €
          </p>
        </div>
      )}
    </div>
  );
}
