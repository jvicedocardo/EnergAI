// src/lib/utils.ts

/**
 * Formatea un número como moneda Euro.
 * Si el valor es nulo o indefinido, devuelve "0.00 €".
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "0.00 €";
  
  // Nos aseguramos de redondear a 2 decimales y añadir el símbolo
  return `${amount.toFixed(2)} €`;
}