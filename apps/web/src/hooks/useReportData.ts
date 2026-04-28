import { useState, useEffect } from 'react';
import type { FullReport } from '@reporte-salas/shared';

interface Filters {
  provinciaId: string;
  zonaId: string;
  complejoId: string;
}

export function useReportData(filters: Filters) {
  const [data, setData] = useState<FullReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.provinciaId) params.set('provinciaId', filters.provinciaId);
    if (filters.zonaId) params.set('zonaId', filters.zonaId);
    if (filters.complejoId) params.set('complejoId', filters.complejoId);

    setLoading(true);
    fetch(`/api/report?${params}`)
      .then(res => res.json())
      .then((report: FullReport) => {
        setData(report);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters.provinciaId, filters.zonaId, filters.complejoId]);

  return { data, loading };
}
