import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createRoutes } from "./main/routes.js";
import { initDatabase } from "./infra/db.js";
dotenv.config();
const app = express();
const PORT = process.env["PORT"] ?? 3000;
app.use(cors());
app.use(express.json({ limit: "50mb" }));
// Rotas da API
app.use(createRoutes());
// Health check
app.get("/", (_req, res) => {
    res.json({ status: "API Histórico de OMs rodando 🚀" });
});
async function start() {
    await initDatabase();
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
}
start().catch((err) => {
    console.error("❌ Falha ao iniciar o servidor:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map