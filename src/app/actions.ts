"use server";

import { prisma } from "@/lib/prisma";
import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

const invoiceSchema = z.object({
  tipo: z.enum(["LUZ", "AGUA", "GAS"]).describe("OBLIGATORIO: Tipo de factura. Elige solo una de las tres opciones."),
  empresa: z.string().describe("Nombre de la empresa emisora de la factura."),
  fecha_emision: z.string().describe("Fecha de emisión en formato YYYY-MM-DD."),
  total_factura: z.number().describe("El importe total a pagar."),
  // Los campos específicos ahora son opcionales en el esquema base
  consumo_kwh: z.number().optional().describe("Consumo eléctrico o de gas en kWh. Obligatorio si el tipo es LUZ o GAS."),
  consumo_m3: z.number().optional().describe("Consumo de agua en metros cúbicos (m3). Obligatorio si el tipo es AGUA."),
});

export type ActionState = {
  success?: boolean;
  error?: string;
  data?: z.infer<typeof invoiceSchema>;
} | null;

export async function analyzeInvoice(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Debes iniciar sesión para subir facturas." };
  }

  try {

  
  const file = formData.get("invoiceFile") as File;
  const selectedModel = formData.get("aiModel") as string || "gemini-2.5-flash";
  
  if (!file || file.size === 0) {
    return { error: "No se ha subido ningún archivo válido." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const { output } = await generateText({
      model: google(selectedModel),
      output: Output.object({ schema: invoiceSchema }),
      system: "Eres un experto procesando facturas españolas. Tu única tarea es extraer los datos del documento y rellenar ESTRICTAMENTE el esquema JSON solicitado. Si no encuentras un dato exacto, infiérelo del contexto, pero NUNCA cambies el nombre de las claves del JSON ni añadas claves nuevas.",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extrae los datos de esta factura." },
            { 
              type: "file", 
              data: uint8Array, 
              mediaType: file.type,
              filename: file.name
            },
          ],
        },
      ],
    });

    await prisma.invoice.create({
      data: { 
        filename: file.name,
        tipo: output.tipo, 
        empresa: output.empresa,
        fecha_emision: output.fecha_emision,
        total_factura: output.total_factura,
        consumo_kwh: output.consumo_kwh,
        consumo_m3: output.consumo_m3,
        userId: session.user.id,
      },
    });

    revalidatePath("/");

    return { success: true, data: output };
  

} catch (error: unknown) {
    console.error("Error analizando la factura:", error);
    
    // 2. Type Narrowing: Extraemos el mensaje de forma segura
    let errorMessage = "Error desconocido";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      // Algunas librerías anidan el error real dentro de 'cause'
      if (error.cause) {
        errorMessage += ` ${String(error.cause)}`;
      }
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      errorMessage = String(error);
    }

    const errorMessageLower = errorMessage.toLowerCase();

    // 3. Evaluamos el mensaje de forma segura
    if (errorMessageLower.includes("high demand") || errorMessageLower.includes("503")) {
      return { 
        error: `El modelo seleccionado (${selectedModel}) está recibiendo excesiva demanda ahora mismo. Por favor, selecciona otro modelo en el desplegable y vuelve a intentarlo.` 
      };
    }

    if (errorMessageLower.includes("not found") || errorMessageLower.includes("404")) {
      return { 
        error: `El modelo seleccionado (${selectedModel}) no está disponible en tu región o plan de Google. Prueba con otra opción.` 
      };
    }

    return { error: "Hubo un problema de conexión al analizar la factura con IA. Inténtalo de nuevo." };
  }

}catch (error) {
    console.error("Error crítico en analyzeInvoice:", error);
    
    // Devolvemos un objeto de error seguro en lugar de romper la app
    return { 
      error: "Hubo un problema procesando la factura. Comprueba que el archivo sea legible y vuelve a intentarlo." 
    };
  }
}

export async function deleteInvoice(id: string, formData?: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    await prisma.invoice.delete({
      where: { 
        id: id,
        userId: session.user.id
      },
    });
    revalidatePath("/");
    
  } catch (error) {
    console.error("Error al borrar la factura:", error);
  }
}

type ChartDataPoint = { name: string; LUZ: number; AGUA: number; GAS: number };

export async function generateEnergyInsight(
  chartData: ChartDataPoint[], 
  filterContext: string, 
  selectedModel: string // <-- NUEVO
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  try {
    if (!chartData || chartData.length === 0) {
      return { error: "No hay datos en esta vista para analizar. Prueba a cambiar los filtros." };
    }

    const dataString = JSON.stringify(chartData, null, 2);

    const { text } = await generateText({
      model: google(selectedModel), // Usamos dinámicamente el modelo que nos pasa el cliente
      system: `Eres un asesor energético experto, directo y amable. 
      Analiza el historial de gasto mensual del usuario que te proporcionaré.
      REGLAS ESTRICTAS:
      1. Responde en un MÁXIMO de 3 frases.
      2. Identifica la tendencia principal.
      3. Dale un único consejo práctico y muy específico para ahorrar.
      4. No uses saludos formales largos, ve directo al análisis.`,
      prompt: `El usuario está viendo este periodo: ${filterContext}.\nAquí tienes el resumen de gastos por mes:\n${dataString}`,
    });

    return { success: true, insight: text };

  } catch (error: unknown) {
    console.error(`Error generando insight con el modelo ${selectedModel}:`, error);
    
    // Mejoramos el manejo de errores para avisar sobre cuotas
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      return { error: "Se ha alcanzado el límite de uso para este modelo. Por favor, selecciona otro modelo en el desplegable." };
    } else if (errorMessage.includes("503") || errorMessage.includes("overloaded")) {
      return { error: "Este modelo está sobrecargado ahora mismo (muy común en modelos nuevos). Prueba con otro." };
    }

    return { error: "El modelo seleccionado no está disponible o ha fallado. Prueba a seleccionar otro diferente." };
  }
}