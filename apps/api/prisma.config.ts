import { config } from "dotenv";
import path from "path";

// Load environment variables from the monorepo root
config({ path: path.resolve(__dirname, "../../.env") });

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "ts-node prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
