import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";
import type { IMaintenanceOrderRepository } from "../../domain/repositories/IMaintenanceOrderRepository.js";
import type {
  MaintenanceOrder,
  AddMaintenanceOrderInput,
} from "../../domain/entities/MaintenanceOrder.js";
import {
  EXCEL_COLUMN_MAP,
  ENTITY_TO_EXCEL_MAP,
} from "../../domain/entities/MaintenanceOrder.js";

// xlsx é CJS — usar createRequire para compatibilidade com ESM
const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

export class ExcelOrderRepository implements IMaintenanceOrderRepository {
  constructor(private readonly dataDir: string) {}

  async listAll(slug: string): Promise<MaintenanceOrder[]> {
    const filePath = this.resolveFilePath(slug);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo não encontrado para o equipamento: ${slug}`);
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      throw new Error(`Planilha vazia para o equipamento: ${slug}`);
    }

    const sheet = workbook.Sheets[sheetName]!;
    const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
    });

    return rawRows.map((row: Record<string, unknown>) => this.mapRowToEntity(row));
  }

  async add(slug: string, order: AddMaintenanceOrderInput): Promise<void> {
    const filePath = this.resolveFilePath(slug);

    let workbook: any;
    let sheetName: string;

    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
      sheetName = workbook.SheetNames[0] ?? "Sheet1";
    } else {
      // Cria um novo workbook com os headers
      workbook = XLSX.utils.book_new();
      sheetName = "Sheet1";
      const headers = Object.keys(EXCEL_COLUMN_MAP);
      const emptySheet = XLSX.utils.aoa_to_sheet([headers]);
      XLSX.utils.book_append_sheet(workbook, emptySheet, sheetName);
    }

    const sheet = workbook.Sheets[sheetName]!;

    // Converte entidade para row do Excel
    const excelRow: Record<string, string> = {};
    for (const [entityKey, value] of Object.entries(order)) {
      const excelCol = ENTITY_TO_EXCEL_MAP[entityKey as keyof MaintenanceOrder];
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

  async listEquipments(): Promise<string[]> {
    if (!fs.existsSync(this.dataDir)) {
      return [];
    }

    const files = fs.readdirSync(this.dataDir);
    return files
      .filter((f) => f.endsWith(".xlsx") && !f.startsWith("~$"))
      .map((f) => f.replace(".xlsx", ""));
  }

  async seedEquipment(_slug: string, _orders: MaintenanceOrder[]): Promise<void> {
    throw new Error("Seed não suportado no repositório Excel. Use PostgresOrderRepository.");
  }

  private resolveFilePath(slug: string): string {
    // Sanitiza o slug para evitar path traversal
    const safeName = slug.replace(/[^a-zA-Z0-9_\-]/g, "");
    return path.join(this.dataDir, `${safeName}.xlsx`);
  }

  private mapRowToEntity(row: Record<string, unknown>): MaintenanceOrder {
    const entity: Record<string, string> = {};

    for (const [excelCol, entityKey] of Object.entries(EXCEL_COLUMN_MAP)) {
      const value = row[excelCol];
      entity[entityKey] = value != null ? String(value) : "";
    }

    return entity as unknown as MaintenanceOrder;
  }
}
