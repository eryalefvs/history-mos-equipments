import type { IMaintenanceOrderRepository } from "../../domain/repositories/IMaintenanceOrderRepository.js";
import type { MaintenanceOrder } from "../../domain/entities/MaintenanceOrder.js";

export class ListHistoryUseCase {
  constructor(
    private readonly repository: IMaintenanceOrderRepository
  ) {}

  async execute(slug: string): Promise<MaintenanceOrder[]> {
    return this.repository.listAll(slug);
  }
}