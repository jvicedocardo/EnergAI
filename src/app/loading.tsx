// src/app/loading.tsx
import { InvoiceCardSkeleton, ChartSkeleton } from "@/components/Skeletons";

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Simulamos la cabecera (fija, sin pulse para no marear) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Mi Panel de Energía
            </h1>
            <p className="text-gray-500 mt-1">
              Cargando tus datos de forma segura...
            </p>
          </div>
          <div className="h-12 w-48 bg-blue-200 rounded-lg animate-pulse"></div>
        </div>

        {/* El Skeleton del Gráfico */}
        <ChartSkeleton />

        {/* El Skeleton de la cuadrícula de Facturas */}
        <div className="space-y-12">
          <section>
            <div className="flex items-center mb-5">
              <div className="h-8 w-40 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="grow h-px bg-gray-300 ml-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <InvoiceCardSkeleton key={i} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
