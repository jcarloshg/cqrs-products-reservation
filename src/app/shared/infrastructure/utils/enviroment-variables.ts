import * as dotenv from "dotenv";
dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

export interface AppConfig {
  port: number;
  nodeEnv: string;
  jwt?: JWTConfig;
  cors: CORSConfig;
  POSTGRES_ENV: POSTGRES_ENV;
}

export interface POSTGRES_ENV {
  POSTGRES_URL: string;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface CORSConfig {
  origin: string;
  credentials: boolean;
}

export interface LoggingConfig {
  level: "error" | "warn" | "info" | "debug";
  format: "json" | "simple";
}

class EnviromentVariables {
  private static instance: AppConfig;

  public static load(): AppConfig {
    if (!this.instance) {
      this.instance = {
        // ─────────────────────────────────────
        // TODO: update with your enviroment variables
        // ─────────────────────────────────────
        port: parseInt(process.env.PORT || "3000"),
        nodeEnv: process.env.NODE_ENV || "development",
        jwt: process.env.JWT_SECRET
          ? {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || "15m",
            refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
          }
          : undefined,
        cors: {
          origin: "*",
          credentials: process.env.CORS_CREDENTIALS === "true",
        },
        POSTGRES_ENV: {
          POSTGRES_URL: process.env.POSTGRES_URL || "NOT-FOUND",
          POSTGRES_DB: process.env.POSTGRES_DB || "NOT-FOUND",
          POSTGRES_USER: process.env.POSTGRES_USER || "NOT-FOUND",
          POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "NOT-FOUND",
        },
      };
    }
    console.log(`[this.instance] -> `, this.instance);
    return this.instance;
  }
}

export const enviromentVariables = EnviromentVariables.load();
