import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export default sql;

export async function initChatsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS chats (
      id          TEXT        PRIMARY KEY,
      user_id     TEXT        NOT NULL,
      title       TEXT        NOT NULL,
      messages    JSONB       NOT NULL DEFAULT '[]',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS chats_user_idx ON chats (user_id, created_at DESC)
  `;
}
