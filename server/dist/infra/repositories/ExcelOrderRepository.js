import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";
import { EXCEL_COLUMN_MAP, ENTITY_TO_EXCEL_MAP, } from "../../domain/entities/MaintenanceOrder.js";
// xlsx é CJS — usar createRequire para compatibilidade com ESM
const require = createRequire(import.meta.url);
const XLSX = require("xlsx");
export class ExcelOrderRepository {
    dataDir;
    constructor(dataDir) {
        this.dataDir = dataDir;
    }
    async listAll(slug) {
        const filePath = this.resolveFilePath(slug);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Arquivo não encontrado para o equipamento: ${slug}`);
        }
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
            throw new Error(`Planilha vazia para o equipamento: ${slug}`);
        }
        const sheet = workbook.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json(sheet, {
            defval: "",
        });
        return rawRows.map((row) => this.mapRowToEntity(row));
    }
    async add(slug, order) {
        const filePath = this.resolveFilePath(slug);
        let workbook;
        let sheetName;
        if (fs.existsSync(filePath)) {
            workbook = XLSX.readFile(filePath);
            sheetName = workbook.SheetNames[0] ?? "Sheet1";
        }
        else {
            // Cria um novo workbook com os headers
            workbook = XLSX.utils.book_new();
            sheetName = "Sheet1";
            const headers = Object.keys(EXCEL_COLUMN_MAP);
            const emptySheet = XLSX.utils.aoa_to_sheet([headers]);
            XLSX.utils.book_append_sheet(workbook, emptySheet, sheetName);
        }
        const sheet = workbook.Sheets[sheetName];
        // Converte entidade para row do Excel
        const excelRow = {};
        for (const [entityKey, value] of Object.entries(order)) {
            const excelCol = ENTITY_TO_EXCEL_MAP[entityKey];
            if (excelCol) {
                excelRow[excelCol] = value;
            }
        }
        // Adiciona a nova linha ao final
        XLSX.utils.sheet_add_json(sheet, [excelRow], {
            skipHeader: true,
            origin: -1,
        });
        XLSX.writeFile(workbook, filePath);
    }
    async listEquipments() {
        if (!fs.existsSync(this.dataDir)) {
            return [];
        }
        const files = fs.readdirSync(this.dataDir);
        return files
            .filter((f) => f.endsWith(".xlsx") && !f.startsWith("~$"))
            .map((f) => f.replace(".xlsx", ""));
    }
    resolveFilePath(slug) {
        // Sanitiza o slug para evitar path traversal
        const safeName = slug.replace(/[^a-zA-Z0-9_\-]/g, "");
        return path.join(this.dataDir, `${safeName}.xlsx`);
    }
    mapRowToEntity(row) {
        const entity = {};
        for (const [excelCol, entityKey] of Object.entries(EXCEL_COLUMN_MAP)) {
            const value = row[excelCol];
            entity[entityKey] = value != null ? String(value) : "";
        }
        return entity;
    }
}
//# sourceMappingURL=ExcelOrderRepository.js.map