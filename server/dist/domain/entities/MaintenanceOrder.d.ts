export interface MaintenanceOrder {
    ordem: string;
    dataInicio: string;
    dataFim: string;
    localInstalacao: string;
    tipoOrdem: string;
    textoBreve: string;
    statusUsuario: string;
    denominacaoLocal: string;
    dataEntrada: string;
    centroTrabalho: string;
    tipoPrioridade: string;
    centroTrabResponsavel: string;
    prioridade: string;
}
export interface AddMaintenanceOrderInput {
    ordem: string;
    dataInicio: string;
    dataFim: string;
    localInstalacao: string;
    tipoOrdem: string;
    textoBreve: string;
    statusUsuario: string;
    denominacaoLocal: string;
    dataEntrada: string;
    centroTrabalho: string;
    tipoPrioridade: string;
    centroTrabResponsavel: string;
    prioridade: string;
}
/** Mapeamento: nome da coluna no Excel → campo da entidade */
export declare const EXCEL_COLUMN_MAP: Record<string, keyof MaintenanceOrder>;
/** Mapeamento inverso: campo da entidade → nome da coluna no Excel */
export declare const ENTITY_TO_EXCEL_MAP: Record<keyof MaintenanceOrder, string>;
//# sourceMappingURL=MaintenanceOrder.d.ts.map