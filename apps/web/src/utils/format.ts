export function formatPesos(amount: number): string {
  if (amount === 0) return '$0';
  return '$' + amount.toLocaleString('es-AR');
}

export function formatEntradas(count: number): string {
  if (count === 0) return '0';
  return count.toLocaleString('es-AR');
}

const DAY_NAMES: Record<string, string> = {
  '2026-04-23': 'Thu',
  '2026-04-24': 'Fri',
  '2026-04-25': 'Sat',
  '2026-04-26': 'Sun',
  '2026-04-27': 'Mon',
  '2026-04-28': 'Tue',
  '2026-04-29': 'Wed',
};

export function getDayName(date: string): string {
  return DAY_NAMES[date] || '';
}
