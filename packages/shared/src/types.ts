export interface Provincia {
  id: number;
  nombre: string;
}

export interface Zona {
  id: number;
  nombre: string;
  provinciaId: number;
}

export interface Complejo {
  id: number;
  nombre: string;
  zonaId: number;
}

export interface DailyData {
  entradas: number;
  recaudacion: number;
}

export interface ReportRow {
  salaId: number;
  salaNombre: string;
  pelicula: string;
  daily: Record<string, DailyData>;
  subWeekend: DailyData;
  subWeekdays: DailyData;
  weekTotal: DailyData;
}

export interface ComplejoReport {
  complejo: Complejo;
  rows: ReportRow[];
  totals: { daily: Record<string, DailyData>; subWeekend: DailyData; subWeekdays: DailyData; weekTotal: DailyData };
}

export interface ZonaReport {
  zona: Zona;
  complejos: ComplejoReport[];
  totals: { daily: Record<string, DailyData>; subWeekend: DailyData; subWeekdays: DailyData; weekTotal: DailyData };
}

export interface ProvinciaReport {
  provincia: Provincia;
  zonas: ZonaReport[];
  totals: { daily: Record<string, DailyData>; subWeekend: DailyData; subWeekdays: DailyData; weekTotal: DailyData };
}

export interface FullReport {
  fechaDesde: string;
  fechaHasta: string;
  fechaBajada: string;
  days: string[];
  provincias: ProvinciaReport[];
  totalPais: { daily: Record<string, DailyData>; subWeekend: DailyData; subWeekdays: DailyData; weekTotal: DailyData };
}

export interface FilterOptions {
  provincias: Provincia[];
  zonas: Zona[];
  complejos: Complejo[];
}

export type TotalsLevel = 'complejo' | 'zona' | 'provincia' | 'pais';
