import db from './connection.js';
import { createTables } from './schema.js';

// Reset and recreate
db.exec('DROP TABLE IF EXISTS funcion_diaria');
db.exec('DROP TABLE IF EXISTS sala');
db.exec('DROP TABLE IF EXISTS complejo');
db.exec('DROP TABLE IF EXISTS zona');
db.exec('DROP TABLE IF EXISTS provincia');
createTables();

const insertProv = db.prepare('INSERT INTO provincia (nombre) VALUES (?)');
const insertZona = db.prepare('INSERT INTO zona (nombre, provincia_id) VALUES (?, ?)');
const insertComplejo = db.prepare('INSERT INTO complejo (nombre, zona_id) VALUES (?, ?)');
const insertSala = db.prepare('INSERT INTO sala (nombre, complejo_id) VALUES (?, ?)');
const insertFuncion = db.prepare('INSERT INTO funcion_diaria (sala_id, pelicula, fecha, entradas, recaudacion) VALUES (?, ?, ?, ?, ?)');

const seed = db.transaction(() => {
  // Provincias
  const bsAs = insertProv.run('Buenos Aires').lastInsertRowid as number;
  const caba = insertProv.run('Capital Federal').lastInsertRowid as number;
  const cba = insertProv.run('Cordoba').lastInsertRowid as number;

  // Zonas
  const z9Julio = insertZona.run('9 de Julio', bsAs).lastInsertRowid as number;
  const zBahia = insertZona.run('Bahía Blanca', bsAs).lastInsertRowid as number;
  const zCabaCentro = insertZona.run('CABA Centro', caba).lastInsertRowid as number;
  const zCabaNorte = insertZona.run('CABA Norte', caba).lastInsertRowid as number;
  const zCbaCapital = insertZona.run('Córdoba Capital', cba).lastInsertRowid as number;

  // Complejos
  const c1 = insertComplejo.run('Tu Cine 9 de Julio', z9Julio).lastInsertRowid as number;
  const c2 = insertComplejo.run('Cine Visión', zBahia).lastInsertRowid as number;
  const c3 = insertComplejo.run('Cinemacenter Bahía Blanca', zBahia).lastInsertRowid as number;
  const c4 = insertComplejo.run('Atlas Flores', zCabaCentro).lastInsertRowid as number;
  const c5 = insertComplejo.run('Hoyts Abasto', zCabaNorte).lastInsertRowid as number;
  const c6 = insertComplejo.run('Showcase Córdoba', zCbaCapital).lastInsertRowid as number;

  // Salas
  const s1 = insertSala.run('Tu Cine 9 de Julio 01', c1).lastInsertRowid as number;
  const s2 = insertSala.run('Cine Visión 01', c2).lastInsertRowid as number;
  const s3 = insertSala.run('Cine Visión 02', c2).lastInsertRowid as number;
  const s4 = insertSala.run('Cinemacenter Bahía Blanca 01', c3).lastInsertRowid as number;
  const s5 = insertSala.run('Cinemacenter Bahía Blanca 02', c3).lastInsertRowid as number;
  const s6 = insertSala.run('Atlas Flores 01', c4).lastInsertRowid as number;
  const s7 = insertSala.run('Hoyts Abasto 01', c5).lastInsertRowid as number;
  const s8 = insertSala.run('Hoyts Abasto 02', c5).lastInsertRowid as number;
  const s9 = insertSala.run('Showcase Córdoba 01', c6).lastInsertRowid as number;
  const s10 = insertSala.run('Showcase Córdoba 02', c6).lastInsertRowid as number;

  const days = [
    '2026-04-23', '2026-04-24', '2026-04-25', '2026-04-26',
    '2026-04-27', '2026-04-28', '2026-04-29',
  ];

  const movies: Record<number, string> = {
    [s1]: 'Michael',
    [s2]: 'Michael',
    [s3]: 'Super Mario Galaxy: La pelicula',
    [s4]: 'Thunderbolts*',
    [s5]: 'Lilo & Stitch',
    [s6]: 'Sinners',
    [s7]: 'Michael',
    [s8]: 'Thunderbolts*',
    [s9]: 'Lilo & Stitch',
    [s10]: 'Sinners',
  };

  // Generate realistic data: weekends higher, weekdays lower
  const weekendMultiplier = [1.0, 1.3, 1.8, 1.6, 0.7, 0.6, 0.5]; // Thu-Wed
  const baseEntradas: Record<number, number> = {
    [s1]: 9, [s2]: 5, [s3]: 7, [s4]: 120, [s5]: 95,
    [s6]: 85, [s7]: 200, [s8]: 180, [s9]: 150, [s10]: 130,
  };
  const avgTicketPrice = 9000; // ~$9000 ARS

  for (const sala of [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10]) {
    for (let i = 0; i < days.length; i++) {
      const base = baseEntradas[sala];
      const mult = weekendMultiplier[i];
      const entradas = Math.round(base * mult + (Math.random() - 0.5) * base * 0.3);
      const recaudacion = entradas * (avgTicketPrice + Math.round((Math.random() - 0.5) * 2000));
      insertFuncion.run(sala, movies[sala], days[i], entradas, recaudacion);
    }
  }
});

seed();
console.log('Database seeded successfully.');
db.close();
