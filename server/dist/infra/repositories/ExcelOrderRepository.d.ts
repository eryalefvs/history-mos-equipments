import type { IMaintenanceOrderRepository } from "../../domain/repositories/IMaintenanceOrderRepository.js";
import type { MaintenanceOrder, AddMaintenanceOrderInput } from "../../domain/entities/MaintenanceOrder.js";
export declare class ExcelOrderRepository implements IMaintenanceOrderRepository {
    private readonly dataDir;
    constructor(dataDir: string);
    listAll(slug: string): Promise<MaintenanceOrder[]>;
    add(slug: string, order: AddMaintenanceOrderInput): Promise<void>;
    listEquipments(): Promise<string[]>;
    private resolveFilePath;
    private mapRowToEntity;
}
//# sourceMappingURL=ExcelOrderRepository.d.ts.map