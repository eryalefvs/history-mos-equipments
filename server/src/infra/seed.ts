import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { initDatabase, pool } from "./db.js";
import { PostgresOrderRepository } from "./repositories/PostgresOrderRepository.js";
import { parseExcelBuffer } from "./excel/parseExcelBuffer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seed() {
  const dataDir =
    process.env["EXCEL_DATA_DIR"] ?? path.resolve(__dirname, "../../data");

  console.log(`🌱 Iniciando seed a partir de: ${dataDir}`);

  await initDatabase();

  const repo = new PostgresOrderRepository(pool);

  if (!fs.existsSync(dataDir)) {
    console.log("⚠️ Diretório de dados não encontrado, pulando seed.");
    await pool.end();
    return;
  }

  const files = fs
    .readdirSync(dataDir)
    .filter((f) => f.endsWith(".xlsx") && !f.startsWith("~$"));

  if (files.length === 0) {
    console.log("⚠️ Nenhum arquivo Excel encontrado.");
    await pool.end();
    return;
  }

  for (const file of files) {
    const slug = file.replace(".xlsx", "");
    const filePath = path.join(dataDir, file);

    console.log(`📄 Processando: ${file} → slug: ${slug}`);

    const buffer = fs.readFileSync(filePath);
    const orders = parseExcelBuffer(buffer);

    await repo.seedEquipment(slug, orders);
    console.log(`  ✅ ${orders.length} ordens inseridas.`);
  }

  console.log("🎉 Seed concluído!");
  await pool.end();
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
