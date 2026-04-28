import type { DailyData, TotalsLevel } from '@reporte-salas/shared';
import { formatPesos, formatEntradas } from '../utils/format.js';

interface Totals {
  daily: Record<string, DailyData>;
  subWeekend: DailyData;
  subWeekdays: DailyData;
  weekTotal: DailyData;
}

interface Props {
  label: string;
  totals: Totals;
  days: string[];
  level: TotalsLevel;
}

export function TotalsRow({ label, totals, days, level }: Props) {
  return (
    <tr className={`totals-row totals-${level}`}>
      <td className="cell-totals-label" colSpan={2}>{label}</td>
      {days.map(day => {
        const d = totals.daily[day];
        return [
          <td key={`${day}-e`} className="cell-num">{formatEntradas(d.entradas)}</td>,
          <td key={`${day}-g`} className="cell-num">{formatPesos(d.recaudacion)}</td>,
        ];
      })}
      <td className="cell-num">{formatEntradas(totals.subWeekend.entradas)}</td>
      <td className="cell-num">{formatPesos(totals.subWeekend.recaudacion)}</td>
      <td className="cell-num">{formatEntradas(totals.subWeekdays.entradas)}</td>
      <td className="cell-num">{formatPesos(totals.subWeekdays.recaudacion)}</td>
      <td className="cell-num">{formatEntradas(totals.weekTotal.entradas)}</td>
      <td className="cell-num">{formatPesos(totals.weekTotal.recaudacion)}</td>
    </tr>
  );
}
