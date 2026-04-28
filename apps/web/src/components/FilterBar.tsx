import type { FilterOptions } from '@reporte-salas/shared';

interface Props {
  options: FilterOptions;
  selected: { provinciaId: string; zonaId: string; complejoId: string };
  onProvinciaChange: (id: string) => void;
  onZonaChange: (id: string) => void;
  onComplejoChange: (id: string) => void;
}

export function FilterBar({ options, selected, onProvinciaChange, onZonaChange, onComplejoChange }: Props) {
  return (
    <div className="filter-bar">
      <label>
        Provincia:
        <select value={selected.provinciaId} onChange={e => onProvinciaChange(e.target.value)}>
          <option value="">Todas</option>
          {options.provincias.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
      </label>
      <label>
        Zona:
        <select value={selected.zonaId} onChange={e => onZonaChange(e.target.value)}>
          <option value="">Todas</option>
          {options.zonas.map(z => (
            <option key={z.id} value={z.id}>{z.nombre}</option>
          ))}
        </select>
      </label>
      <label>
        Complejo:
        <select value={selected.complejoId} onChange={e => onComplejoChange(e.target.value)}>
          <option value="">Todos</option>
          {options.complejos.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
