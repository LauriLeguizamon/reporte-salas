import type { ZonaReport } from '@reporte-salas/shared';
import { ComplejoBlock } from './ComplejoBlock.js';
import { TotalsRow } from './TotalsRow.js';
import { getDayName } from '../utils/format.js';

interface Props {
  data: ZonaReport;
  days: string[];
}

export function ZonaSection({ data, days }: Props) {
  const COL_COUNT = 22;
  return (
    <>
      {/* Zona header */}
      <tr className="zona-header">
        <td colSpan={COL_COUNT}>Zona: {data.zona.nombre}</td>
      </tr>

      {/* Column headers row 1: dates + labels */}
      <tr className="col-header-dates">
        <td rowSpan={2} className="col-header-cell">Sala</td>
        <td rowSpan={2} className="col-header-cell">Película</td>
        {days.map(day => (
          <td key={day} colSpan={2} className="col-header-cell col-header-date">
            {day}<br />{getDayName(day)}
          </td>
        ))}
        <td colSpan={2} className="col-header-cell">Sub Weekend</td>
        <td colSpan={2} className="col-header-cell">Sub Weekdays</td>
        <td colSpan={2} className="col-header-cell col-header-total">Week&nbsp;Total</td>
      </tr>

      {/* Column headers row 2: Entr/Gross for each pair */}
      <tr className="col-header-sub">
        {days.map(day => [
          <td key={`${day}-e`} className="col-header-cell col-sub-label">Entr</td>,
          <td key={`${day}-g`} className="col-header-cell col-sub-label">Gross</td>,
        ])}
        <td className="col-header-cell col-sub-label">Entr</td>
        <td className="col-header-cell col-sub-label">Gross</td>
        <td className="col-header-cell col-sub-label">Entr</td>
        <td className="col-header-cell col-sub-label">Gross</td>
        <td className="col-header-cell col-sub-label">Entr</td>
        <td className="col-header-cell col-sub-label">Gross</td>
      </tr>

      {/* Complejos */}
      {data.complejos.map(c => (
        <ComplejoBlock key={c.complejo.id} data={c} days={days} />
      ))}

      {/* Zona totals */}
      <TotalsRow
        label={`Totales Zona: ${data.zona.nombre}`}
        totals={data.totals}
        days={days}
        level="zona"
      />
    </>
  );
}
