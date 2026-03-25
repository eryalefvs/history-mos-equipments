import { parseExcelBuffer } from "../../infra/excel/parseExcelBuffer.js";
export class HistoryController {
    listHistoryUseCase;
    addOrderUseCase;
    listEquipmentsUseCase;
    seedEquipmentUseCase;
    constructor(listHistoryUseCase, addOrderUseCase, listEquipmentsUseCase, seedEquipmentUseCase) {
        this.listHistoryUseCase = listHistoryUseCase;
        this.addOrderUseCase = addOrderUseCase;
        this.listEquipmentsUseCase = listEquipmentsUseCase;
        this.seedEquipmentUseCase = seedEquipmentUseCase;
    }
    list = async (req, res) => {
        try {
            const slug = req.params.slug;
            if (!slug) {
                res.status(400).json({ error: "Slug do equipamento é obrigatório." });
                return;
            }
            const orders = await this.listHistoryUseCase.execute(slug);
            res.json({ equipment: slug, orders });
        }
        catch (error) {
            if (error instanceof Error && error.message.includes("não encontrado")) {
                res.status(404).json({ error: error.message });
                return;
            }
            console.error("Erro ao listar histórico:", error);
            res.status(500).json({ error: "Erro interno do servidor." });
        }
    };
    add = async (req, res) => {
        try {
            const slug = req.params.slug;
            const orderData = req.body;
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
        }
        catch (error) {
            console.error("Erro ao adicionar ordem:", error);
            res.status(500).json({ error: "Erro interno do servidor." });
        }
    };
    listEquipments = async (_req, res) => {
        try {
            const equipments = await this.listEquipmentsUseCase.execute();
            res.json({ equipments });
        }
        catch (error) {
            console.error("Erro ao listar equipamentos:", error);
            res.status(500).json({ error: "Erro interno do servidor." });
        }
    };
    upload = async (req, res) => {
        try {
            const { fileName, fileBase64 } = req.body;
            if (!fileName || !fileBase64) {
                res
                    .status(400)
                    .json({ error: "fileName e fileBase64 são obrigatórios." });
                return;
            }
            if (!fileName.endsWith(".xlsx")) {
                res.status(400).json({ error: "Apenas arquivos .xlsx são aceitos." });
                return;
            }
            const slug = fileName
                .replace(/\.xlsx$/i, "")
                .replace(/[^a-zA-Z0-9_\-]/g, "");
            const buffer = Buffer.from(fileBase64, "base64");
            const orders = parseExcelBuffer(buffer);
            await this.seedEquipmentUseCase.execute(slug, orders);
            res.json({
                message: `${orders.length} ordens importadas para "${slug}".`,
                equipment: slug,
                count: orders.length,
            });
        }
        catch (error) {
            console.error("Erro no upload:", error);
            res.status(500).json({ error: "Erro ao processar arquivo." });
        }
    };
}
//# sourceMappingURL=HistoryController.js.map