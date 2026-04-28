import { ReportHeader } from './components/ReportHeader.js';
import { FilterBar } from './components/FilterBar.js';
import { ReportTable } from './components/ReportTable.js';
import { useFilters } from './hooks/useFilters.js';
import { useReportData } from './hooks/useReportData.js';

export default function App() {
  const { options, selected, setProvincia, setZona, setComplejo } = useFilters();
  const { data, loading } = useReportData(selected);

  return (
    <div className="app">
      {data && (
        <ReportHeader
          fechaBajada={data.fechaBajada}
          fechaDesde={data.fechaDesde}
          fechaHasta={data.fechaHasta}
        />
      )}
      <FilterBar
        options={options}
        selected={selected}
        onProvinciaChange={setProvincia}
        onZonaChange={setZona}
        onComplejoChange={setComplejo}
      />
      {loading && <div className="loading">Cargando...</div>}
      {data && !loading && <ReportTable report={data} />}
    </div>
  );
}
