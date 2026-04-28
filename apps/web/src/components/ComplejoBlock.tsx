import type { ComplejoReport } from '@reporte-salas/shared';
import { DataRow } from './DataRow.js';
import { TotalsRow } from './TotalsRow.js';

interface Props {
  data: ComplejoReport;
  days: string[];
}

export function ComplejoBlock({ data, days }: Props) {
  const COL_COUNT = 22;
  return (
    <>
      <tr className="complejo-header">
        <td colSpan={COL_COUNT}>Complejo: {data.complejo.nombre}</td>
      </tr>
      {data.rows.map((row, i) => (
        <DataRow key={`${row.salaId}-${row.pelicula}`} row={row} days={days} even={i % 2 === 0} />
      ))}
      <TotalsRow
        label={`Totales Complejo: ${data.complejo.nombre}`}
        totals={data.totals}
        days={days}
        level="complejo"
      />
    </>
  );
}
