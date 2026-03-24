import type { Request, Response } from "express";
import type { ListHistoryUseCase } from "../../app/use-cases/ListHistoryUseCase.js";
import type { AddOrderUseCase } from "../../app/use-cases/AddOrderUseCase.js";
import type { ListEquipmentsUseCase } from "../../app/use-cases/ListEquipmentsUseCase.js";
import type { AddMaintenanceOrderInput } from "../../domain/entities/MaintenanceOrder.js";

export class HistoryController {
  constructor(
    private readonly listHistoryUseCase: ListHistoryUseCase,
    private readonly addOrderUseCase: AddOrderUseCase,
    private readonly listEquipmentsUseCase: ListEquipmentsUseCase
  ) {}

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const slug = req.params.slug as string;

      if (!slug) {
        res.status(400).json({ error: "Slug do equipamento é obrigatório." });
        return;
      }

      const orders = await this.listHistoryUseCase.execute(slug);
      res.json({ equipment: slug, orders });
    } catch (error) {
      if (error instanceof Error && error.message.includes("não encontrado")) {
        res.status(404).json({ error: error.message });
        return;
      }
      console.error("Erro ao listar histórico:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  };

  add = async (req: Request, res: Response): Promise<void> => {
    try {
      const slug = req.params.slug as string;
      const orderData = req.body as AddMaintenanceOrderInput;

      if (!slug) {
        res.status(400).json({ error: "Slug do equipamento é obrigatório." });
        return;
      }

      if (!orderData.ordem) {
        res.status(400).json({ error: "Número da ordem é obrigatório." });
        return;
      }

      await this.addOrderUseCase.execute(slug, orderData);
      res.status(201).json({ message: "Ordem adicionada com sucesso." });
    } catch (error) {
      console.error("Erro ao adicionar ordem:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  };

  listEquipments = async (_req: Request, res: Response): Promise<void> => {
    try {
      const equipments = await this.listEquipmentsUseCase.execute();
      res.json({ equipments });
    } catch (error) {
      console.error("Erro ao listar equipamentos:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  };
}
