import type pg from "pg";
import type { IMaintenanceOrderRepository } from "../../domain/repositories/IMaintenanceOrderRepository.js";
import type { MaintenanceOrder, AddMaintenanceOrderInput } from "../../domain/entities/MaintenanceOrder.js";
export declare class PostgresOrderRepository implements IMaintenanceOrderRepository {
    private readonly pool;
    constructor(pool: pg.Pool);
    listAll(slug: string): Promise<MaintenanceOrder[]>;
    add(slug: string, order: AddMaintenanceOrderInput): Promise<void>;
    listEquipments(): Promise<string[]>;
    seedEquipment(slug: string, orders: MaintenanceOrder[]): Promise<void>;
}
//# sourceMappingURL=PostgresOrderRepository.d.ts.map