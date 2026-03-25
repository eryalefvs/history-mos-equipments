import { createRequire } from "node:module";
import { EXCEL_COLUMN_MAP, } from "../../domain/entities/MaintenanceOrder.js";
const require = createRequire(import.meta.url);
const XLSX = require("xlsx");
export function parseExcelBuffer(buffer) {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
        throw new Error("Planilha vazia.");
    }
    const sheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
    });
    return rawRows.map((row) => {
        const entity = {};
        for (const [excelCol, entityKey] of Object.entries(EXCEL_COLUMN_MAP)) {
            const value = row[excelCol];
            entity[entityKey] = value != null ? String(value) : "";
        }
        return entity;
    });
}
//# sourceMappingURL=parseExcelBuffer.js.map