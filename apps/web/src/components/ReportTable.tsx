import { Fragment } from 'react';
import type { FullReport } from '@reporte-salas/shared';
import { ZonaSection } from './ZonaSection.js';
import { TotalsRow } from './TotalsRow.js';

interface Props {
  report: FullReport;
}

export function ReportTable({ report }: Props) {
  return (
    <div className="report-table-wrapper">
      <table className="report-table">
        <tbody>
          {report.provincias.map(pr => (
            <Fragment key={pr.provincia.id}>
              {/* Provincia header */}
              <tr className="provincia-header">
                <td colSpan={22}>
                  <strong>País: Argentina</strong>
                  <br />
                  <strong>Provincia: {pr.provincia.nombre}</strong>
                </td>
              </tr>

              {pr.zonas.map(zr => (
                <ZonaSection key={zr.zona.id} data={zr} days={report.days} />
              ))}

              {/* Provincia totals - only if multiple zonas */}
              {pr.zonas.length > 1 && (
                <TotalsRow
                  label={`Totales Provincia: ${pr.provincia.nombre}`}
                  totals={pr.totals}
                  days={report.days}
                  level="provincia"
                />
              )}
            </Fragment>
          ))}

          {/* País totals */}
          <TotalsRow
            label="TOTALES PAÍS: Argentina"
            totals={report.totalPais}
            days={report.days}
            level="pais"
          />
        </tbody>
      </table>
      <div className="report-footer">
        &copy; Ultracine
      </div>
    </div>
  );
}
