import type { IMaintenanceOrderRepository } from "../../domain/repositories/IMaintenanceOrderRepository.js";
import type { AddMaintenanceOrderInput } from "../../domain/entities/MaintenanceOrder.js";
export declare class AddOrderUseCase {
    private readonly repository;
    constructor(repository: IMaintenanceOrderRepository);
    execute(slug: string, order: AddMaintenanceOrderInput): Promise<void>;
}
//# sourceMappingURL=AddOrderUseCase.d.ts.map