import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";

//declarar a variavel NODE_ENV no docker-compose.yml
const host = process.env.IS_COMPOSE === "dockerdev" ? "db" : "localhost";

export const AppDataSource =
  process.env.NODE_ENV === "test"
    ? new DataSource({
        type: "sqlite",
        database: ":memory:",
        entities: ["src/entities/**/*.ts"],
        synchronize: true,
      })
    : new DataSource({
        type: "postgres",
        host,
        port: 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        synchronize: false,
        logging: false,
        entities: ["./src/entities/*.ts"],
        migrations: ["./src/migrations/*.ts"],
      });
