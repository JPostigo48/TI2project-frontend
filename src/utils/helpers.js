// Funciones utilitarias del proyecto

/**
 * Calcula estadísticas básicas de un arreglo de números.
 * Devuelve el mínimo, máximo y promedio (con dos decimales).
 *
 * @param {number[]} numbers
 */
export function calculateStats(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return { min: 0, max: 0, avg: 0 };
  }
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const avg = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  return {
    min,
    max,
    avg: parseFloat(avg.toFixed(2)),
  };
}
