import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createRoutes } from "./main/routes.js";

dotenv.config();

const app = express();
const PORT = process.env["PORT"] ?? 3000;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use(createRoutes());

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "API Histórico de OMs rodando 🚀" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});