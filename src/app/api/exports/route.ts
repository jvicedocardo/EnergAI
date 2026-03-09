// src/app/api/export/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  try {
    // 1. Obtenemos TODAS las facturas del usuario (sin filtrar por fecha)
    const invoices = await prisma.invoice.findMany({
      where: { userId: session.user.id },
      orderBy: { fecha_emision: "desc" },
    });

    // 2. Definimos las cabeceras (Separadas por punto y coma para el Excel europeo)
    const headers = ["ID Factura", "Fecha Emision", "Empresa", "Tipo", "Total (€)", "Consumo (kWh/m3)"];

    // Función auxiliar para escapar campos de texto (por si la empresa tiene un ";" en su nombre)
    const escapeField = (field: string | number | null | undefined) => {
      if (field == null) return '""';
      return `"${String(field).replace(/"/g, '""')}"`;
    };

    // 3. Mapeamos los datos a filas
    const rows = invoices.map((inv) => {
      // Unificamos el consumo en una sola columna para que sea más fácil de leer en Excel
      const consumo = inv.tipo === "AGUA" ? inv.consumo_m3 : inv.consumo_kwh;
      
      return [
        escapeField(inv.id),
        escapeField(inv.fecha_emision),
        escapeField(inv.empresa),
        escapeField(inv.tipo),
        escapeField(inv.total_factura), // Excel entenderá esto como número
        escapeField(consumo)
      ].join(";"); // <-- PUNTO Y COMA
    });

    // 4. Unimos todo. 
    // \uFEFF es el BOM (Byte Order Mark) UTF-8. Obliga a Excel a leer bien los acentos.
    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\n");

    // 5. Devolvemos un archivo directamente al navegador
    const today = new Date().toISOString().split("T")[0];
    
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        // Esto le dice al navegador "Descarga esto como un archivo, no lo abras"
        "Content-Disposition": `attachment; filename="Mis_Facturas_EnergAI_${today}.csv"`,
      },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error al exportar a Excel:", errorMessage);
    return new NextResponse("Error interno generando el archivo", { status: 500 });
  }
}