// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './utils';

// 'describe' agrupa una serie de tests relacionados
describe('formatCurrency', () => {
  
  // 'it' o 'test' define un caso de prueba individual
  it('debería formatear un número entero correctamente', () => {
    const result = formatCurrency(150);
    expect(result).toBe('150.00 €');
  });

  it('debería redondear correctamente los decimales', () => {
    const result = formatCurrency(45.678);
    expect(result).toBe('45.68 €'); // Fíjate cómo el .toFixed(2) redondea el 8 hacia arriba
  });

  it('debería manejar valores nulos o indefinidos', () => {
    expect(formatCurrency(null)).toBe('0.00 €');
    expect(formatCurrency(undefined)).toBe('0.00 €');
  });

});