import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { ExcelOrderRepository } from "../infra/repositories/ExcelOrderRepository.js";
import { ListHistoryUseCase } from "../app/use-cases/ListHistoryUseCase.js";
import { AddOrderUseCase } from "../app/use-cases/AddOrderUseCase.js";
import { ListEquipmentsUseCase } from "../app/use-cases/ListEquipmentsUseCase.js";
import { HistoryController } from "../presentation/controllers/HistoryController.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export function makeHistoryController() {
    const dataDir = process.env["EXCEL_DATA_DIR"] ?? path.resolve(__dirname, "../../data");
    const repository = new ExcelOrderRepository(dataDir);
    const listHistoryUseCase = new ListHistoryUseCase(repository);
    const addOrderUseCase = new AddOrderUseCase(repository);
    const listEquipmentsUseCase = new ListEquipmentsUseCase(repository);
    return new HistoryController(listHistoryUseCase, addOrderUseCase, listEquipmentsUseCase);
}
//# sourceMappingURL=factories.js.map