import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(databaseUrl, {
  fetchOptions: {
    cache: "no-store",
  },
});

export const db = drizzle({ client: sql, schema });
