import type { IMaintenanceOrderRepository } from "../../domain/repositories/IMaintenanceOrderRepository.js";
import type { MaintenanceOrder } from "../../domain/entities/MaintenanceOrder.js";
export declare class ListHistoryUseCase {
    private readonly repository;
    constructor(repository: IMaintenanceOrderRepository);
    execute(slug: string): Promise<MaintenanceOrder[]>;
}
//# sourceMappingURL=ListHistoryUseCase.d.ts.map