/**
 * Formatea un número como moneda colombiana (COP)
 * @param amount - El monto a formatear
 * @returns String formateado como "$1.000 COP"
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} COP`;
}

/**
 * Formatea un número como moneda colombiana con decimales
 * @param amount - El monto a formatear
 * @returns String formateado como "$1.000,00 COP"
 */
export function formatCurrencyWithDecimals(amount: number): string {
  return `$${amount.toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} COP`;
}
