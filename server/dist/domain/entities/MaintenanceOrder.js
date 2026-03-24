/** Mapeamento: nome da coluna no Excel → campo da entidade */
export const EXCEL_COLUMN_MAP = {
    "Ordem": "ordem",
    "Data base de início": "dataInicio",
    "Data base de fim": "dataFim",
    "Local de instalação": "localInstalacao",
    "Tipo de ordem": "tipoOrdem",
    "Texto breve": "textoBreve",
    "Status usuário": "statusUsuario",
    "Denominação do loc.instalação": "denominacaoLocal",
    "Data da entrada": "dataEntrada",
    "Centro de trabalho": "centroTrabalho",
    "Tipo de prioridade": "tipoPrioridade",
    "Centro trab.responsável": "centroTrabResponsavel",
    "Prioridade": "prioridade",
};
/** Mapeamento inverso: campo da entidade → nome da coluna no Excel */
export const ENTITY_TO_EXCEL_MAP = Object.fromEntries(Object.entries(EXCEL_COLUMN_MAP).map(([k, v]) => [v, k]));
//# sourceMappingURL=MaintenanceOrder.js.map