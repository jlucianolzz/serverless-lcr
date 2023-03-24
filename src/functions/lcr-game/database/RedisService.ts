import { createClient, RedisClientType } from "redis";

export class RedisService {
  private client: RedisClientType;

  constructor(options: any) {
    this.client = createClient({
      password: options.password,
      socket: {
        host: options.host,
        port: +(options.port || "6379"),
      },
    });
  }

  async connect(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.client.once("ready", () => {
        resolve();
      });
      this.client.once("error", (err) => {
        reject(err);
      });
      this.client.connect();
    });
  }

  async disconnect(): Promise<void> {
    this.client.quit();
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
}
