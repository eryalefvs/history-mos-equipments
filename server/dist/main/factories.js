import { PostgresOrderRepository } from "../infra/repositories/PostgresOrderRepository.js";
import { pool } from "../infra/db.js";
import { ListHistoryUseCase } from "../app/use-cases/ListHistoryUseCase.js";
import { AddOrderUseCase } from "../app/use-cases/AddOrderUseCase.js";
import { ListEquipmentsUseCase } from "../app/use-cases/ListEquipmentsUseCase.js";
import { SeedEquipmentUseCase } from "../app/use-cases/SeedEquipmentUseCase.js";
import { HistoryController } from "../presentation/controllers/HistoryController.js";
export function makeHistoryController() {
    const repository = new PostgresOrderRepository(pool);
    const listHistoryUseCase = new ListHistoryUseCase(repository);
    const addOrderUseCase = new AddOrderUseCase(repository);
    const listEquipmentsUseCase = new ListEquipmentsUseCase(repository);
    const seedEquipmentUseCase = new SeedEquipmentUseCase(repository);
    return new HistoryController(listHistoryUseCase, addOrderUseCase, listEquipmentsUseCase, seedEquipmentUseCase);
}
//# sourceMappingURL=factories.js.map