import redis, { RedisClient } from "redis";
import { config } from "../config";

export class RedisDatabase {
  private static _client: RedisClient;

  public static get client(): RedisClient {
    if (typeof this._client === "undefined") {
      this._client = redis.createClient(config.redis.url);
    }
    return this._client;
  }

  public static async set(key: string, value: object | number | string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._client.set(key, JSON.stringify(value), (err, _) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  public static async get<T>(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this._client.get(key, (err, value) => {
        if (err) return reject(err);
        return resolve(JSON.parse(value || ""));
      });
    });
  }
}
