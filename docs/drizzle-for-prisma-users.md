# Drizzle orientation

Drizzle expresses tables in TypeScript and infers types from those definitions. Drizzle Kit generates SQL migrations from schema changes; review and commit SQL before applying it. The selected PostgreSQL driver performs the database connection work.

Workflow for this project: edit table definitions → generate migration → review SQL → test against isolated database → apply through the deployment workflow. Avoid schema push against production.

Keep application operations behind the task repository boundary so UI and server input contracts do not depend on ORM syntax. Better Auth owns its authentication tables; generate those from the installed auth version.

Sources: https://orm.drizzle.team/docs/get-started/postgresql-new and https://better-auth.com/docs/adapters/drizzle

Current status: packages installed and exports resolved. Database schema/migrations and live connectivity are not implemented yet. Stable Drizzle releases were selected instead of the RC shown in the current getting-started guide.
