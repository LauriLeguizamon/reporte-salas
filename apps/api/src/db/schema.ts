import db from './connection.js';

export function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS provincia (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS zona (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      provincia_id INTEGER NOT NULL REFERENCES provincia(id)
    );

    CREATE TABLE IF NOT EXISTS complejo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      zona_id INTEGER NOT NULL REFERENCES zona(id)
    );

    CREATE TABLE IF NOT EXISTS sala (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      complejo_id INTEGER NOT NULL REFERENCES complejo(id)
    );

    CREATE TABLE IF NOT EXISTS funcion_diaria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sala_id INTEGER NOT NULL REFERENCES sala(id),
      pelicula TEXT NOT NULL,
      fecha DATE NOT NULL,
      entradas INTEGER NOT NULL DEFAULT 0,
      recaudacion INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_funcion_fecha ON funcion_diaria(fecha);
    CREATE INDEX IF NOT EXISTS idx_funcion_sala ON funcion_diaria(sala_id);
  `);
}
