import { ACADEMIC_HOURS, DAY_INDEX } from './constants'; 


// Funciones utilitarias del proyecto

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

