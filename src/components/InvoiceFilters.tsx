// src/components/InvoiceFilters.tsx
"use client";

export default function InvoiceFilters({
  currentYear,
  currentMonth,
  currentType,
}: {
  currentYear: string;
  currentMonth: string;
  currentType: string;
}) {
  return (
    <form
      method="GET"
      action="/"
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-end mb-8"
    >
      <div className="w-full md:w-1/4">
        <label
          htmlFor="year"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
        >
          Año
        </label>
        {/* Cambiamos a text-gray-900 para máximo contraste */}
        <select
          id="year"
          name="year"
          defaultValue={currentYear}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border text-sm text-gray-900 bg-white font-medium"
        >
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>

      <div className="w-full md:w-1/4">
        <label
          htmlFor="month"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
        >
          Mes
        </label>
        <select
          id="month"
          name="month"
          defaultValue={currentMonth}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border text-sm text-gray-900 bg-white font-medium"
        >
          <option value="ALL">Todos los meses</option>
          <option value="01">Enero</option>
          <option value="02">Febrero</option>
          <option value="03">Marzo</option>
          <option value="04">Abril</option>
          <option value="05">Mayo</option>
          <option value="06">Junio</option>
          <option value="07">Julio</option>
          <option value="08">Agosto</option>
          <option value="09">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
      </div>

      <div className="w-full md:w-1/4">
        <label
          htmlFor="type"
          className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
        >
          Tipo
        </label>
        <select
          id="type"
          name="type"
          defaultValue={currentType}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border text-sm text-gray-900 bg-white font-medium"
        >
          <option value="ALL">Todas las facturas</option>
          <option value="LUZ">⚡ Luz</option>
          <option value="AGUA">💧 Agua</option>
          <option value="GAS">🔥 Gas</option>
        </select>
      </div>

      <div className="w-full md:w-1/4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md border border-transparent hover:bg-blue-700 transition-colors shadow-sm"
        >
          Aplicar Filtros
        </button>
      </div>
    </form>
  );
}
