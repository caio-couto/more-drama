import "./envConfig";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle-dev",
  schema: "./src/lib/database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});



