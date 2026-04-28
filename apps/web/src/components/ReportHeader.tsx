interface Props {
  fechaBajada: string;
  fechaDesde: string;
  fechaHasta: string;
}

export function ReportHeader({ fechaBajada, fechaDesde, fechaHasta }: Props) {
  return (
    <div className="report-header">
      <div className="report-title">
        Reporte: Salas con Recaudación || Screens Box Office (Argentina)
      </div>
      <div className="report-subtitle">
        Fecha de bajada: {fechaBajada} :: Información desde {fechaDesde} hasta {fechaHasta}
      </div>
    </div>
  );
}
