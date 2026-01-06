import { SignOptions } from "jsonwebtoken";

const corsOrigins = process.env.CORS_ORIGIN?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  database: {
    url: process.env.DATABASE_URL || "",
  },

  redis: {
    url: process.env.REDIS_URL,
  },

  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    expiresIn:
      (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) ?? "24h",
  },

  cors: {
    origin:
      corsOrigins && corsOrigins.length > 0
        ? corsOrigins
        : ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  },

  socket: {
    cors: {
      origin:
        corsOrigins && corsOrigins.length > 0
          ? corsOrigins
          : ["http://localhost:5173", "http://127.0.0.1:5173"],
      credentials: true,
    },
  },

  business: {
    reliabilityScore: {
      min: 0.4,
      max: 1.0,
      default: 0.7,
    },
    reinforcement: {
      defaultExpirationHours: 24,
    },
  },
};

export type Config = typeof config;
