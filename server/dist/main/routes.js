import { Router } from "express";
import { makeHistoryController } from "./factories.js";
export function createRoutes() {
    const router = Router();
    const controller = makeHistoryController();
    // Lista equipamentos disponíveis
    router.get("/api/equipments", controller.listEquipments);
    // Lista histórico de OMs por equipamento
    router.get("/api/history/:slug", controller.list);
    // Adiciona uma nova OM ao equipamento
    router.post("/api/history/:slug", controller.add);
    return router;
}
//# sourceMappingURL=routes.js.map