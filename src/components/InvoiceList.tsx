// src/components/InvoiceList.tsx
import { prisma } from "@/lib/prisma";
// 1. Importamos la nueva Server Action
import { deleteInvoice } from "@/app/actions";

// Pequeño helper para dar estilo según el tipo de factura
const getStyleByType = (tipo: string) => {
  switch (tipo) {
    case "LUZ":
      return {
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        icon: "⚡",
      };
    case "AGUA":
      return {
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "💧",
      };
    case "GAS":
      return {
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: "🔥",
      };
    default:
      return {
        color: "text-gray-600",
        bg: "bg-gray-50",
        border: "border-gray-200",
        icon: "📄",
      };
  }
};

export default async function InvoiceList() {
  // Obtenemos las facturas ordenadas por fecha de creación (las más nuevas primero)
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (invoices.length === 0) {
    return (
      <div className="w-full text-center py-10 mt-8 border-t border-gray-200">
        <p className="text-gray-500 italic">
          No hay facturas procesadas todavía. ¡Sube la primera!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Historial de Facturas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {invoices.map((invoice) => {
          const style = getStyleByType(invoice.tipo);

          // 2. Preparamos la función con el ID de esta factura en concreto
          const deleteWithId = deleteInvoice.bind(null, invoice.id);

          return (
            <div
              key={invoice.id}
              className={`rounded-xl shadow-sm border p-5 relative flex flex-col justify-between ${style.border} bg-white transition-all hover:shadow-md`}
            >
              {/* Cabecera: Etiqueta y Botón de Borrar */}
              <div className="flex justify-between items-start mb-3">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${style.bg} ${style.color}`}
                >
                  <span>{style.icon}</span> {invoice.tipo}
                </span>

                {/* 3. El formulario que ejecuta el borrado */}
                <form action={deleteWithId}>
                  <button
                    type="submit"
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Borrar factura"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Datos Generales */}
              <div className="mb-4">
                <h3
                  className="font-semibold text-lg text-gray-800 truncate"
                  title={invoice.empresa || "Desconocida"}
                >
                  {invoice.empresa || "Desconocida"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Emitida:{" "}
                  <span className="font-medium text-gray-700">
                    {invoice.fecha_emision || "N/A"}
                  </span>
                </p>
              </div>

              {/* Métricas Dinámicas */}
              <div className="space-y-1 text-sm text-gray-600 mb-4 border-t border-gray-100 pt-3">
                {invoice.tipo === "AGUA" ? (
                  <div className="flex justify-between">
                    <span>Consumo:</span>{" "}
                    <span className="font-medium">{invoice.consumo_m3} m³</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span>Consumo:</span>{" "}
                    <span className="font-medium">
                      {invoice.consumo_kwh} kWh
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="mt-auto flex justify-between items-end bg-gray-50 -mx-5 -mb-5 p-4 rounded-b-xl border-t border-gray-100">
                <span className="text-xs font-bold uppercase text-gray-500">
                  Total Factura
                </span>
                <span className={`text-2xl font-black ${style.color}`}>
                  {invoice.total_factura
                    ? `${invoice.total_factura} €`
                    : "-- €"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
