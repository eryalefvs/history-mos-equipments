import type { IMaintenanceOrderRepository } from "../../domain/repositories/IMaintenanceOrderRepository.js";
import type { MaintenanceOrder } from "../../domain/entities/MaintenanceOrder.js";
export declare class SeedEquipmentUseCase {
    private readonly repository;
    constructor(repository: IMaintenanceOrderRepository);
    execute(slug: string, orders: MaintenanceOrder[]): Promise<void>;
}
//# sourceMappingURL=SeedEquipmentUseCase.d.ts.map