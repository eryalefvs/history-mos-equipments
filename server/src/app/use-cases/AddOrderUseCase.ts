import type { IMaintenanceOrderRepository } from "../../domain/repositories/IMaintenanceOrderRepository.js";
import type { AddMaintenanceOrderInput } from "../../domain/entities/MaintenanceOrder.js";

export class AddOrderUseCase {
  constructor(
    private readonly repository: IMaintenanceOrderRepository
  ) {}

  async execute(slug: string, order: AddMaintenanceOrderInput): Promise<void> {
    await this.repository.add(slug, order);
  }
}