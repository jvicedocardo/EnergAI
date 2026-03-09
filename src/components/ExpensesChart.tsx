// src/components/ExpensesChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Definimos la forma exacta de los datos que espera este componente
type ChartData = {
  name: string;
  LUZ: number;
  AGUA: number;
  GAS: number;
};

export default function ExpensesChart({ data }: { data: ChartData[] }) {
  // Si no hay datos, no renderizamos el recuadro vacío
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-6">
        Evolución de Gastos
      </h2>

      {/* ResponsiveContainer hace que el gráfico se adapte a móviles y pantallas grandes */}
      <div className="h-87.5 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {/* Rejilla de fondo discreta */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />

            {/* Ejes con tipografía limpia */}
            <XAxis
              dataKey="name"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}€`}
            />

            {/* Tooltip interactivo al pasar el ratón */}
            <Tooltip
              cursor={{ fill: "#F3F4F6" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number | undefined) => [
                `${(value || 0).toFixed(2) ?? 0} €`,
                "",
              ]}
            />

            {/* Leyenda superior */}
            <Legend wrapperStyle={{ paddingTop: "20px" }} />

            {/* Barras Apiladas (stackId="a" las agrupa una encima de otra) */}
            {/* Usamos los colores exactos de Tailwind para mantener la coherencia */}
            <Bar
              dataKey="LUZ"
              name="Luz"
              stackId="a"
              fill="#EAB308"
              radius={[0, 0, 4, 4]}
            />
            <Bar dataKey="GAS" name="Gas" stackId="a" fill="#F97316" />
            <Bar
              dataKey="AGUA"
              name="Agua"
              stackId="a"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
