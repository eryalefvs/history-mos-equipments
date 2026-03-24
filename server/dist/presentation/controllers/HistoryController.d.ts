import type { Request, Response } from "express";
import type { ListHistoryUseCase } from "../../app/use-cases/ListHistoryUseCase.js";
import type { AddOrderUseCase } from "../../app/use-cases/AddOrderUseCase.js";
import type { ListEquipmentsUseCase } from "../../app/use-cases/ListEquipmentsUseCase.js";
export declare class HistoryController {
    private readonly listHistoryUseCase;
    private readonly addOrderUseCase;
    private readonly listEquipmentsUseCase;
    constructor(listHistoryUseCase: ListHistoryUseCase, addOrderUseCase: AddOrderUseCase, listEquipmentsUseCase: ListEquipmentsUseCase);
    list: (req: Request, res: Response) => Promise<void>;
    add: (req: Request, res: Response) => Promise<void>;
    listEquipments: (_req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=HistoryController.d.ts.map