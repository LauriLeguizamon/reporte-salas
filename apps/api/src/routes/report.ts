import { Router } from 'express';
import db from '../db/connection.js';
import type { DailyData, FullReport, ProvinciaReport, ZonaReport, ComplejoReport, ReportRow } from '@reporte-salas/shared';

const router = Router();

const DAYS = ['2026-04-23', '2026-04-24', '2026-04-25', '2026-04-26', '2026-04-27', '2026-04-28', '2026-04-29'];
const WEEKEND_DAYS = ['2026-04-23', '2026-04-24', '2026-04-25', '2026-04-26']; // Thu-Sun
const WEEKDAY_DAYS = ['2026-04-27', '2026-04-28', '2026-04-29']; // Mon-Wed

function emptyDaily(): DailyData {
  return { entradas: 0, recaudacion: 0 };
}

function emptyDailyMap(): Record<string, DailyData> {
  const map: Record<string, DailyData> = {};
  for (const d of DAYS) map[d] = emptyDaily();
  return map;
}

function emptyTotals() {
  return { daily: emptyDailyMap(), subWeekend: emptyDaily(), subWeekdays: emptyDaily(), weekTotal: emptyDaily() };
}

function addTo(target: DailyData, source: DailyData) {
  target.entradas += source.entradas;
  target.recaudacion += source.recaudacion;
}

interface RawRow {
  sala_id: number;
  sala_nombre: string;
  pelicula: string;
  fecha: string;
  entradas: number;
  recaudacion: number;
  complejo_id: number;
  complejo_nombre: string;
  zona_id: number;
  zona_nombre: string;
  provincia_id: number;
  provincia_nombre: string;
}

router.get('/', (req, res) => {
  const { provinciaId, zonaId, complejoId } = req.query;

  let where = '';
  const params: unknown[] = [];

  if (complejoId) {
    where = 'WHERE c.id = ?';
    params.push(complejoId);
  } else if (zonaId) {
    where = 'WHERE z.id = ?';
    params.push(zonaId);
  } else if (provinciaId) {
    where = 'WHERE p.id = ?';
    params.push(provinciaId);
  }

  const rows = db.prepare(`
    SELECT
      s.id as sala_id, s.nombre as sala_nombre,
      f.pelicula, f.fecha, f.entradas, f.recaudacion,
      c.id as complejo_id, c.nombre as complejo_nombre,
      z.id as zona_id, z.nombre as zona_nombre,
      p.id as provincia_id, p.nombre as provincia_nombre
    FROM funcion_diaria f
    JOIN sala s ON f.sala_id = s.id
    JOIN complejo c ON s.complejo_id = c.id
    JOIN zona z ON c.zona_id = z.id
    JOIN provincia p ON z.provincia_id = p.id
    ${where}
    ORDER BY p.nombre, z.nombre, c.nombre, s.nombre, f.pelicula, f.fecha
  `).all(...params) as RawRow[];

  // Build hierarchy
  const provinciaMap = new Map<number, ProvinciaReport>();
  const zonaMap = new Map<number, ZonaReport>();
  const complejoMap = new Map<number, ComplejoReport>();
  const rowKey = (salaId: number, pelicula: string) => `${salaId}:${pelicula}`;
  const reportRowMap = new Map<string, ReportRow>();

  for (const row of rows) {
    // Ensure provincia
    if (!provinciaMap.has(row.provincia_id)) {
      provinciaMap.set(row.provincia_id, {
        provincia: { id: row.provincia_id, nombre: row.provincia_nombre },
        zonas: [],
        totals: emptyTotals(),
      });
    }

    // Ensure zona
    if (!zonaMap.has(row.zona_id)) {
      const zr: ZonaReport = {
        zona: { id: row.zona_id, nombre: row.zona_nombre, provinciaId: row.provincia_id },
        complejos: [],
        totals: emptyTotals(),
      };
      zonaMap.set(row.zona_id, zr);
      provinciaMap.get(row.provincia_id)!.zonas.push(zr);
    }

    // Ensure complejo
    if (!complejoMap.has(row.complejo_id)) {
      const cr: ComplejoReport = {
        complejo: { id: row.complejo_id, nombre: row.complejo_nombre, zonaId: row.zona_id },
        rows: [],
        totals: emptyTotals(),
      };
      complejoMap.set(row.complejo_id, cr);
      zonaMap.get(row.zona_id)!.complejos.push(cr);
    }

    // Ensure report row
    const key = rowKey(row.sala_id, row.pelicula);
    if (!reportRowMap.has(key)) {
      const rr: ReportRow = {
        salaId: row.sala_id,
        salaNombre: row.sala_nombre,
        pelicula: row.pelicula,
        daily: emptyDailyMap(),
        subWeekend: emptyDaily(),
        subWeekdays: emptyDaily(),
        weekTotal: emptyDaily(),
      };
      reportRowMap.set(key, rr);
      complejoMap.get(row.complejo_id)!.rows.push(rr);
    }

    // Fill daily data
    const rr = reportRowMap.get(key)!;
    const dayData: DailyData = { entradas: row.entradas, recaudacion: row.recaudacion };
    rr.daily[row.fecha] = dayData;

    if (WEEKEND_DAYS.includes(row.fecha)) {
      addTo(rr.subWeekend, dayData);
    } else {
      addTo(rr.subWeekdays, dayData);
    }
    addTo(rr.weekTotal, dayData);
  }

  // Aggregate totals up the hierarchy
  const totalPais = emptyTotals();

  for (const [, pr] of provinciaMap) {
    for (const zr of pr.zonas) {
      for (const cr of zr.complejos) {
        for (const rr of cr.rows) {
          for (const day of DAYS) {
            addTo(cr.totals.daily[day], rr.daily[day]);
          }
          addTo(cr.totals.subWeekend, rr.subWeekend);
          addTo(cr.totals.subWeekdays, rr.subWeekdays);
          addTo(cr.totals.weekTotal, rr.weekTotal);
        }
        for (const day of DAYS) {
          addTo(zr.totals.daily[day], cr.totals.daily[day]);
        }
        addTo(zr.totals.subWeekend, cr.totals.subWeekend);
        addTo(zr.totals.subWeekdays, cr.totals.subWeekdays);
        addTo(zr.totals.weekTotal, cr.totals.weekTotal);
      }
      for (const day of DAYS) {
        addTo(pr.totals.daily[day], zr.totals.daily[day]);
      }
      addTo(pr.totals.subWeekend, zr.totals.subWeekend);
      addTo(pr.totals.subWeekdays, zr.totals.subWeekdays);
      addTo(pr.totals.weekTotal, zr.totals.weekTotal);
    }
    for (const day of DAYS) {
      addTo(totalPais.daily[day], pr.totals.daily[day]);
    }
    addTo(totalPais.subWeekend, pr.totals.subWeekend);
    addTo(totalPais.subWeekdays, pr.totals.subWeekdays);
    addTo(totalPais.weekTotal, pr.totals.weekTotal);
  }

  const report: FullReport = {
    fechaDesde: '2026-04-23',
    fechaHasta: '2026-04-29',
    fechaBajada: '2026-04-24',
    days: DAYS,
    provincias: Array.from(provinciaMap.values()),
    totalPais,
  };

  res.json(report);
});

export default router;
