import type { MaintenanceOrder, AddMaintenanceOrderInput } from "../entities/MaintenanceOrder.js";

export interface IMaintenanceOrderRepository {
  /** Lista todas as OMs de um equipamento pelo slug */
  listAll(slug: string): Promise<MaintenanceOrder[]>;

  /** Adiciona uma nova OM ao equipamento */
  add(slug: string, order: AddMaintenanceOrderInput): Promise<void>;

  /** Lista todos os slugs de equipamentos disponíveis */
  listEquipments(): Promise<string[]>;

  /** Substitui todas as OMs de um equipamento (DELETE + INSERT em transação) */
  seedEquipment(slug: string, orders: MaintenanceOrder[]): Promise<void>;
}