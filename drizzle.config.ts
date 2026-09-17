import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

// Migration generation is offline; applying migrations requires an explicit database URL.
export default defineConfig({
  dialect: 'postgresql',
  schema: ['./src/db/auth-schema.gen.ts', './src/db/schema.ts'],
  out: './drizzle',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
})
