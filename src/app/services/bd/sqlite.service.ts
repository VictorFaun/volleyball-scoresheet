import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.initialize();
  }

  private async initialize() {
    try {
      this.db = await this.sqlite.createConnection('mydb', false, 'no-encryption', 1, false);
      await this.db.open();
      await this.createTables();
    } catch (error) {
      console.error('Error al inicializar SQLite:', error);
    }
  }

  private async createTables() {
    const query = `
      CREATE TABLE IF NOT EXISTS test_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
    `;
    await this.db?.execute(query);
  }

  async addItem(name: string): Promise<number | undefined> {
    const result = await this.db?.run('INSERT INTO test_data (name) VALUES (?);', [name]);
    return result?.changes?.lastId;
  }

  async getItems(): Promise<{ id: number; name: string }[]> {
    const result = await this.db?.query('SELECT * FROM test_data;');
    return result?.values as { id: number; name: string }[];
  }

  async closeConnection() {
    try {
      if (this.db) {
        await this.sqlite.closeConnection('mydb', false);
        this.db = null;
      }
    } catch (error) {
      console.error('Error al cerrar la conexión:', error);
    }
  }
}
