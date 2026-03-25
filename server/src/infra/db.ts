import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env["DATABASE_URL"],
  ssl:
    process.env["NODE_ENV"] === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

export async function initDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS equipments (
      slug VARCHAR(255) PRIMARY KEY
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS maintenance_orders (
      id SERIAL PRIMARY KEY,
      equipment_slug VARCHAR(255) NOT NULL,
      ordem VARCHAR(100) DEFAULT '',
      data_inicio VARCHAR(100) DEFAULT '',
      data_fim VARCHAR(100) DEFAULT '',
      local_instalacao VARCHAR(255) DEFAULT '',
      tipo_ordem VARCHAR(100) DEFAULT '',
      texto_breve TEXT DEFAULT '',
      status_usuario VARCHAR(100) DEFAULT '',
      denominacao_local VARCHAR(255) DEFAULT '',
      data_entrada VARCHAR(100) DEFAULT '',
      centro_trabalho VARCHAR(100) DEFAULT '',
      tipo_prioridade VARCHAR(100) DEFAULT '',
      centro_trab_responsavel VARCHAR(100) DEFAULT '',
      prioridade VARCHAR(100) DEFAULT ''
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_mo_equipment_slug
    ON maintenance_orders(equipment_slug)
  `);

  console.log("✅ Banco de dados inicializado.");
}

export { pool };
