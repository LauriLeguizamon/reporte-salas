import type { ReportRow } from '@reporte-salas/shared';
import { formatPesos, formatEntradas } from '../utils/format.js';

interface Props {
  row: ReportRow;
  days: string[];
  even: boolean;
}

export function DataRow({ row, days, even }: Props) {
  return (
    <tr className={even ? 'row-even' : 'row-odd'}>
      <td className="cell-sala">{row.salaNombre}</td>
      <td className="cell-pelicula">{row.pelicula}</td>
      {days.map(day => {
        const d = row.daily[day];
        if (!d || (d.entradas === 0 && d.recaudacion === 0)) {
          return [
            <td key={`${day}-e`} className="cell-num">-</td>,
            <td key={`${day}-g`} className="cell-num">-</td>,
          ];
        }
        return [
          <td key={`${day}-e`} className="cell-num">{formatEntradas(d.entradas)}</td>,
          <td key={`${day}-g`} className="cell-num">{formatPesos(d.recaudacion)}</td>,
        ];
      })}
      <td className="cell-num">{formatEntradas(row.subWeekend.entradas)}</td>
      <td className="cell-num">{formatPesos(row.subWeekend.recaudacion)}</td>
      <td className="cell-num">{formatEntradas(row.subWeekdays.entradas)}</td>
      <td className="cell-num">{formatPesos(row.subWeekdays.recaudacion)}</td>
      <td className="cell-num cell-total">{formatEntradas(row.weekTotal.entradas)}</td>
      <td className="cell-num cell-total">{formatPesos(row.weekTotal.recaudacion)}</td>
    </tr>
  );
}
