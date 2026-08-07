import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const outDir = path.join(__dirname, 'csv_exports');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

function escapeCsvCell(cell) {
  if (cell === null || cell === undefined) return '';
  let str = String(cell);
  // If cell contains quotes, commas, or newlines, enclose in quotes and double internal quotes
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", [], async (err, tables) => {
  if (err) {
    console.error('Error querying tables:', err);
    process.exit(1);
  }

  console.log(`Found ${tables.length} table(s): ${tables.map(t => t.name).join(', ')}`);

  for (const tableObj of tables) {
    const tableName = tableObj.name;
    await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM "${tableName}"`, [], (err, rows) => {
        if (err) {
          console.error(`Error querying table ${tableName}:`, err);
          return reject(err);
        }

        if (rows.length === 0) {
          console.log(`Table ${tableName} is empty.`);
          const csvPath = path.join(outDir, `${tableName}.csv`);
          fs.writeFileSync(csvPath, '', 'utf8');
          return resolve();
        }

        const headers = Object.keys(rows[0]);
        const csvLines = [];
        csvLines.push(headers.map(escapeCsvCell).join(','));

        for (const row of rows) {
          const line = headers.map(h => escapeCsvCell(row[h])).join(',');
          csvLines.push(line);
        }

        const csvContent = csvLines.join('\n');
        const csvPath = path.join(outDir, `${tableName}.csv`);
        fs.writeFileSync(csvPath, csvContent, 'utf8');
        console.log(`Exported ${rows.length} rows from table "${tableName}" to ${csvPath}`);
        resolve();
      });
    });
  }

  db.close(() => {
    console.log('Finished exporting all tables to CSV!');
  });
});
