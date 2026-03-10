import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import InvoiceFilters from "@/components/InvoiceFilters";
import ExpensesChart from "@/components/ExpensesChart";
import { deleteInvoice } from "@/app/actions";
import { auth } from "@/auth";
import LandingHero from "@/components/LandingHero";
import { Suspense } from "react";
import { ChartSkeleton, InvoiceCardSkeleton } from "@/components/Skeletons";
import AiAdvisorCard from "@/components/AiAdvisorCard";

const MONTH_NAMES: Record<string, string> = {
  "01": "Ene",
  "02": "Feb",
  "03": "Mar",
  "04": "Abr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Ago",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dic",
};

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

async function DashboardData({
  searchParams,
}: {
  searchParams: { year: string; month: string; type: string };
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { year, month, type } = searchParams;

  const whereClause: Prisma.InvoiceWhereInput = {
    //fecha_emision: { startsWith: datePrefix },
    userId: session.user.id,
  };

  if (type !== "ALL") whereClause.tipo = type as "LUZ" | "AGUA" | "GAS";

  if (year !== "ALL") {
    // Escenario A: Tenemos un año concreto (Vuelve tu lógica original)
    // Si mes es ALL busca "2025-", si es un mes busca "2025-10-"
    const datePrefix = month === "ALL" ? `${year}-` : `${year}-${month}-`;
    whereClause.fecha_emision = { startsWith: datePrefix };
  } else if (year === "ALL" && month !== "ALL") {
    // Escenario B: Todos los años, pero un mes en concreto (Ej. Todos los octubres)
    // Buscamos cualquier fecha que contenga en medio "-10-"
    whereClause.fecha_emision = { contains: `-${month}-` };
  }

  const invoices = await prisma.invoice.findMany({
    where: whereClause,
    orderBy: { fecha_emision: "asc" },
  });

  const chartDataMap = new Map<
    string,
    { name: string; LUZ: number; AGUA: number; GAS: number }
  >();

  invoices.forEach((inv) => {
    if (!inv.fecha_emision || !inv.total_factura) return;

    const monthKey = inv.fecha_emision.substring(0, 7); // ej: "2026-03"
    const [invYear, invMonth] = monthKey.split("-");
    const monthLabel = `${MONTH_NAMES[invMonth]} ${invYear.substring(2)}`; // ej: "Mar 26"

    if (!chartDataMap.has(monthKey)) {
      chartDataMap.set(monthKey, { name: monthLabel, LUZ: 0, AGUA: 0, GAS: 0 });
    }

    const dataPoint = chartDataMap.get(monthKey)!;
    dataPoint[inv.tipo as "LUZ" | "AGUA" | "GAS"] += inv.total_factura;
  });

  const chartData = Array.from(chartDataMap.values()).map((d) => ({
    name: d.name,
    LUZ: Number(d.LUZ.toFixed(2)),
    AGUA: Number(d.AGUA.toFixed(2)),
    GAS: Number(d.GAS.toFixed(2)),
  }));

  const invoicesForCards = [...invoices].reverse();

  const groupedInvoices = invoicesForCards.reduce(
    (acc, invoice) => {
      const monthKey = invoice.fecha_emision
        ? invoice.fecha_emision.substring(0, 7)
        : "Desconocido";
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(invoice);
      return acc;
    },
    {} as Record<string, typeof invoicesForCards>,
  );

  const sortedMonths = Object.keys(groupedInvoices).sort().reverse();

  const filterContextText = `Año: ${year}, Mes: ${month === "ALL" ? "Todos" : month}, Tipo: ${type === "ALL" ? "Todos" : type}`;

  return (
    <>
      <ExpensesChart data={chartData} />
      <AiAdvisorCard
        key={filterContextText}
        data={chartData}
        filterContext={filterContextText}
      />
      {sortedMonths.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-lg">
            No hay facturas que coincidan con los filtros (Año: {year}).
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {sortedMonths.map((monthStr) => {
            const [mYear, mMonth] = monthStr.split("-");
            const displayTitle =
              monthStr === "Desconocido"
                ? "Fecha Desconocida"
                : `${MONTH_NAMES[mMonth] || mMonth} 20${mYear.substring(2)}`;

            return (
              <section key={monthStr}>
                <div className="flex items-center mb-5">
                  <h2 className="text-xl font-bold text-gray-800 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
                    {displayTitle}
                  </h2>
                  <div className="grow h-px bg-gray-300 ml-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedInvoices[monthStr].map((invoice) => {
                    const style = getStyleByType(invoice.tipo);
                    const isAgua = invoice.tipo === "AGUA";
                    const deleteWithId = deleteInvoice.bind(null, invoice.id);

                    return (
                      <div
                        key={invoice.id}
                        className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col hover:shadow-md transition-shadow ${style.border}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${style.bg} ${style.color}`}
                          >
                            <span>{style.icon}</span> {invoice.tipo}
                          </span>
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
                        <h3
                          className="font-semibold text-lg truncate text-gray-800"
                          title={invoice.empresa || "Desconocida"}
                        >
                          {invoice.empresa || "Desconocida"}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {invoice.fecha_emision}
                        </p>
                        <div className="mt-auto border-t border-gray-100 pt-4 flex justify-between items-end">
                          <span className="text-gray-500 text-sm font-medium">
                            {isAgua
                              ? `${invoice.consumo_m3} m³`
                              : `${invoice.consumo_kwh} kWh`}
                          </span>
                          <span
                            className={`text-2xl font-black ${style.color}`}
                          >
                            {invoice.total_factura} €
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

export default async function Dashboard(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await auth();
  if (!session?.user) {
    return (
      <main className="w-full bg-slate-50 min-h-screen">
        <LandingHero />
      </main>
    );
  }
  const searchParams = await props.searchParams;

  const year = searchParams.year || new Date().getFullYear().toString();
  const month = searchParams.month || "ALL";
  const type = searchParams.type || "ALL";

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Mi Panel de Energía
            </h1>
            <p className="text-gray-500 mt-1">
              Gestiona y analiza tus facturas domésticas.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="/api/exports"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-lg shadow-sm border border-emerald-700 transition-all"
              title="Descargar histórico en Excel (CSV)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2.41L17.59 9H13V4.41zM11 19l-4-5h2.5c0-.1 0-1.8 0-2h3c0 .2 0 1.9 0 2H15l-4 5z" />
              </svg>
              <span className="hidden sm:inline">Exportar Excel</span>
            </a>

            <Link
              href="/upload"
              className="flex-1 md:flex-none text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm border border-blue-700 transition-all"
            >
              + Subir Nueva Factura
            </Link>
          </div>
        </div>

        <InvoiceFilters
          currentYear={year}
          currentMonth={month}
          currentType={type}
        />

        <Suspense
          key={`${year}-${month}-${type}`}
          fallback={
            <>
              <ChartSkeleton />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <InvoiceCardSkeleton key={i} />
                ))}
              </div>
            </>
          }
        >
          <DashboardData searchParams={{ year, month, type }} />
        </Suspense>
      </div>
    </main>
  );
}
