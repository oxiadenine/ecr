import { SQL, sql } from "bun";

export default class AuthDatabase {
  static client = new SQL({
    adapter: "sqlite",
    filename: `${process.cwd()}/data/db/auth.sqlite`,
    create: true,
    strict: true
  });

  static {
    this.client.begin(async transaction => {
      await transaction`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT NOT NULL PRIMARY KEY, 
          time INTEGER NOT NULL, 
          expiresAt TEXT NOT NULL, 
          iv TEXT NOT NULL, 
          authTag TEXT NOT NULL
        )
      `;
    });
  }

  static sessions = class Sessions {
    static async create(session) {
      await AuthDatabase.client`INSERT INTO sessions ${sql(session)}`;
    }
  
    static async read(id) {
      const result = await AuthDatabase.client`SELECT * FROM sessions WHERE id = ${id}`;

      return result[0];
    }
  
    static async delete(id) {
      await AuthDatabase.client`DELETE FROM sessions ${id ? sql`WHERE id = ${id}` : sql``}`;
    }
  };
}
