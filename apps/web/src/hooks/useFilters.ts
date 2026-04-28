import { useState, useEffect, useCallback } from 'react';
import type { FilterOptions } from '@reporte-salas/shared';

interface SelectedFilters {
  provinciaId: string;
  zonaId: string;
  complejoId: string;
}

export function useFilters() {
  const [options, setOptions] = useState<FilterOptions>({ provincias: [], zonas: [], complejos: [] });
  const [selected, setSelected] = useState<SelectedFilters>({ provinciaId: '', zonaId: '', complejoId: '' });

  const fetchFilters = useCallback(async (provinciaId?: string, zonaId?: string) => {
    const params = new URLSearchParams();
    if (provinciaId) params.set('provinciaId', provinciaId);
    if (zonaId) params.set('zonaId', zonaId);
    const res = await fetch(`/api/filters?${params}`);
    const data: FilterOptions = await res.json();
    setOptions(data);
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const setProvincia = useCallback((provinciaId: string) => {
    setSelected({ provinciaId, zonaId: '', complejoId: '' });
    fetchFilters(provinciaId || undefined);
  }, [fetchFilters]);

  const setZona = useCallback((zonaId: string) => {
    setSelected(prev => ({ ...prev, zonaId, complejoId: '' }));
    fetchFilters(selected.provinciaId || undefined, zonaId || undefined);
  }, [fetchFilters, selected.provinciaId]);

  const setComplejo = useCallback((complejoId: string) => {
    setSelected(prev => ({ ...prev, complejoId }));
  }, []);

  return { options, selected, setProvincia, setZona, setComplejo };
}
