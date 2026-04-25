import { createClient } from "redis";
import { readFileSync } from "fs";

let redisClient: ReturnType<typeof createClient> | null = null;

if (process.env.NODE_ENV === "production") {
  redisClient = createClient({
    username:
      process.env.REDIS_USERNAME ||
      readFileSync("/run/secrets/REDIS_USERNAME", "utf-8").trim(),
    password:
      process.env.REDIS_PASSWORD ||
      readFileSync("/run/secrets/REDIS_PASSWORD", "utf-8").trim(),
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    },
  });
  redisClient.connect().catch(console.error);
  redisClient.on("connect", () => {
    console.log("Connected to redis");
  });
  redisClient.on("ready", () => {
    console.log("Redis connection is ready");
  });
}

export { redisClient };
