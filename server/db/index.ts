import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_DB_PATH = path.resolve(process.cwd(), 'data', 'syc2027.db');

let dbInstance: DatabaseSync | null = null;

/**
 * Returns the resolved SQLite database file path.
 */
export function getDatabasePath(): string {
  return process.env.DATABASE_PATH
    ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
    : DEFAULT_DB_PATH;
}

/**
 * Opens (or returns the cached) SQLite connection and ensures schema is applied.
 */
export function getDb(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = getDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);

  dbInstance = db;
  return db;
}

/**
 * Closes the cached SQLite connection if open.
 */
export function closeDb(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
