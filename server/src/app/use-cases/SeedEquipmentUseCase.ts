import type { IMaintenanceOrderRepository } from "../../domain/repositories/IMaintenanceOrderRepository.js";
import type { MaintenanceOrder } from "../../domain/entities/MaintenanceOrder.js";

export class SeedEquipmentUseCase {
  constructor(
    private readonly repository: IMaintenanceOrderRepository
  ) {}

  async execute(slug: string, orders: MaintenanceOrder[]): Promise<void> {
    await this.repository.seedEquipment(slug, orders);
  }
}
