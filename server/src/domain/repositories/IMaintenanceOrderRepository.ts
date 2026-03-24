import type { MaintenanceOrder, AddMaintenanceOrderInput } from "../entities/MaintenanceOrder.js";

export interface IMaintenanceOrderRepository {
  /** Lista todas as OMs de um equipamento pelo slug (nome do arquivo) */
  listAll(slug: string): Promise<MaintenanceOrder[]>;

  /** Adiciona uma nova OM ao arquivo do equipamento */
  add(slug: string, order: AddMaintenanceOrderInput): Promise<void>;

  /** Lista todos os slugs de equipamentos disponíveis (arquivos .xlsx na pasta data) */
  listEquipments(): Promise<string[]>;
}