import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./reports.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      issue TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      photo TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;
