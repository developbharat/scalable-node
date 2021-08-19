import { Connection, createConnection } from "typeorm";
import ormconfig from "./ormconfig";

export class SQLDatabase {
  private static _conn: Connection;

  public static async init(): Promise<Connection> {
    if (typeof this._conn === "undefined") this._conn = await createConnection(ormconfig);
    return this._conn;
  }

  public static async close(): Promise<void> {
    if (this._conn?.isConnected) await this._conn.close();
  }

  public static get conn(): Connection {
    return this._conn;
  }
}
