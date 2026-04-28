import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createTables } from './db/schema.js';
import { seedIfEmpty } from './db/seed-auto.js';
import filtersRouter from './routes/filters.js';
import reportRouter from './routes/report.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());

createTables();
seedIfEmpty();

app.use('/api/filters', filtersRouter);
app.use('/api/report', reportRouter);

// En producción, servir el frontend estático
const staticPath = path.join(__dirname, '..', '..', 'web', 'dist');
app.use(express.static(staticPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
