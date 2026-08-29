import { defineConfig } from 'drizzle-kit'

// Local development only — a SQLite file instead of production Turso, so
// schema changes can be tried out before they touch the real database.
// Used by `npm run db:push:local`.
export default defineConfig({
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: 'file:.data/local.db',
  },
})
