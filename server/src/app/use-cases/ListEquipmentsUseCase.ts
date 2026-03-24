import type { IMaintenanceOrderRepository } from "../../domain/repositories/IMaintenanceOrderRepository.js";

export class ListEquipmentsUseCase {
  constructor(
    private readonly repository: IMaintenanceOrderRepository
  ) {}

  async execute(): Promise<string[]> {
    return this.repository.listEquipments();
  }
}
