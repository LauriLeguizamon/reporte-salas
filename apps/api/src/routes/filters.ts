import { Router } from 'express';
import db from '../db/connection.js';

const router = Router();

router.get('/', (req, res) => {
  const { provinciaId, zonaId } = req.query;

  const provincias = db.prepare('SELECT id, nombre FROM provincia ORDER BY nombre').all();

  let zonas;
  if (provinciaId) {
    zonas = db.prepare('SELECT id, nombre, provincia_id as provinciaId FROM zona WHERE provincia_id = ? ORDER BY nombre').all(provinciaId);
  } else {
    zonas = db.prepare('SELECT id, nombre, provincia_id as provinciaId FROM zona ORDER BY nombre').all();
  }

  let complejos;
  if (zonaId) {
    complejos = db.prepare('SELECT id, nombre, zona_id as zonaId FROM complejo WHERE zona_id = ? ORDER BY nombre').all(zonaId);
  } else if (provinciaId) {
    complejos = db.prepare(`
      SELECT c.id, c.nombre, c.zona_id as zonaId
      FROM complejo c
      JOIN zona z ON c.zona_id = z.id
      WHERE z.provincia_id = ?
      ORDER BY c.nombre
    `).all(provinciaId);
  } else {
    complejos = db.prepare('SELECT id, nombre, zona_id as zonaId FROM complejo ORDER BY nombre').all();
  }

  res.json({ provincias, zonas, complejos });
});

export default router;
