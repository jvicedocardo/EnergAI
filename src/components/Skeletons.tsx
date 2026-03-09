// src/components/Skeletons.tsx

export function InvoiceCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col animate-pulse h-45">
      {/* Cabecera (Etiqueta y botón borrar) */}
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-6 bg-gray-200 rounded-md"></div>
      </div>

      {/* Título y Fecha */}
      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>

      {/* Footer (Consumo y Precio) */}
      <div className="mt-auto border-t border-gray-100 pt-4 flex justify-between items-end">
        <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
        <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  const pseudoRandomHeights = [30, 65, 45, 85, 50, 95, 40, 75, 55, 90, 35, 70];

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>

      <div className="h-87.5 w-full flex items-end gap-4 pb-8">
        {pseudoRandomHeights.map((height, i) => (
          <div
            key={i}
            className="bg-gray-200 w-full rounded-t-md transition-all"
            style={{ height: `${height}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
