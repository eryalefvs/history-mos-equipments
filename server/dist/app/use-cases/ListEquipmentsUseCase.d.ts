import type { IMaintenanceOrderRepository } from "../../domain/repositories/IMaintenanceOrderRepository.js";
export declare class ListEquipmentsUseCase {
    private readonly repository;
    constructor(repository: IMaintenanceOrderRepository);
    execute(): Promise<string[]>;
}
//# sourceMappingURL=ListEquipmentsUseCase.d.ts.map