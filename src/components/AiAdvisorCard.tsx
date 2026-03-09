// src/components/AiAdvisorCard.tsx
"use client";

import { useState, useTransition } from "react";
import { generateEnergyInsight } from "@/app/actions";

type ChartDataPoint = { name: string; LUZ: number; AGUA: number; GAS: number };

export default function AiAdvisorCard({
  data,
  filterContext,
}: {
  data: ChartDataPoint[];
  filterContext: string;
}) {
  const [insight, setInsight] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // NUEVO: Estado para controlar el modelo seleccionado
  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.5-pro");

  const [isPending, startTransition] = useTransition();

  const handleGetAdvice = () => {
    setErrorMsg(null);
    startTransition(async () => {
      // Pasamos el selectedModel como tercer argumento
      const result = await generateEnergyInsight(
        data,
        filterContext,
        selectedModel,
      );
      if (result.error) {
        setErrorMsg(result.error);
      } else if (result.success && result.insight) {
        setInsight(result.insight);
      }
    });
  };

  return (
    <div className="w-full relative rounded-2xl bg-linear-to-r from-blue-500 via-purple-500 to-indigo-500 p-0.5 mb-8 shadow-md">
      <div className="w-full h-full bg-white rounded-[14px] p-6 flex flex-col items-start">
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9.315 7.584C12.195 3.883 16.695 1.5 21.5 1.5c-1.5 4.805-3.883 9.305-7.584 12.195-2.83 2.16-5.835 3.51-9.125 3.966-.54.075-1.09.11-1.64.11-1.1 0-2.155-.21-3.13-.585C1.5 15.655 4.545 13.59 7.375 10.76c2.51-2.51 3.545-5.32 4.145-8.245.04-.195.075-.395.11-.595.69 2.07 1.635 3.96 2.76 5.615L15 6l-5.685 1.584zM3.75 22.5c0-.621.504-1.125 1.125-1.125h.375V21a1.125 1.125 0 012.25 0v.375h.375c.621 0 1.125.504 1.125 1.125s-.504 1.125-1.125 1.125h-.375V24a1.125 1.125 0 01-2.25 0v-.375h-.375c-.621 0-1.125-.504-1.125-1.125z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Asesor Energético IA
            </h2>
          </div>

          {/* NUEVO: Selector de Modelos pequeño y discreto en la esquina */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={isPending}
            className="text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
            title="Selecciona el modelo de IA"
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Rápido)</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro (Estable)</option>
            <option value="gemini-3.0-flash">Gemini 3.0 Flash (Nuevo)</option>
            <option value="gemini-pro">Gemini Pro (Legacy Fallback)</option>
          </select>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          Analizaremos tu <strong>vista actual ({filterContext})</strong> para
          detectar tendencias y darte consejos de ahorro personalizados.
        </p>

        {!insight && !isPending && (
          <button
            onClick={handleGetAdvice}
            disabled={data.length === 0}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-colors shadow-sm"
          >
            {data.length === 0
              ? "Sin datos para analizar"
              : "Generar Análisis de esta vista"}
          </button>
        )}

        {/* ... (El resto del componente (Skeleton, insight, errorMsg) se mantiene exactamente igual) ... */}
        {isPending && (
          <div className="w-full space-y-3 animate-pulse mt-2">
            <div className="h-4 bg-purple-100 rounded w-3/4"></div>
            <div className="h-4 bg-purple-100 rounded w-full"></div>
            <div className="h-4 bg-purple-100 rounded w-5/6"></div>
          </div>
        )}

        {insight && !isPending && (
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-5 w-full mt-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <p className="text-gray-800 leading-relaxed font-medium italic">
              {insight}
            </p>
            <button
              onClick={handleGetAdvice}
              className="mt-4 text-xs font-bold text-purple-600 hover:text-purple-800 underline transition-colors"
            >
              Regenerar consejo
            </button>
          </div>
        )}

        {errorMsg && !isPending && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 w-full">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
