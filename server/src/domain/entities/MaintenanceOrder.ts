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
export const EXCEL_COLUMN_MAP: Record<string, keyof MaintenanceOrder> = {
  "Ordem": "ordem",
  "Data-base do início": "dataInicio",
  "Data-base do fim": "dataFim",
  "Local de instalação": "localInstalacao",
  "Tipo de ordem": "tipoOrdem",
  "Texto breve": "textoBreve",
  "Status usuário": "statusUsuario",
  "Denominação do loc.instalação": "denominacaoLocal",
  "Data de entrada": "dataEntrada",
  "Centro de trabalho": "centroTrabalho",
  "Tipo de prioridade": "tipoPrioridade",
  "Centro trab.respons.": "centroTrabResponsavel",
  "Prioridade": "prioridade",
};

/** Mapeamento inverso: campo da entidade → nome da coluna no Excel */
export const ENTITY_TO_EXCEL_MAP: Record<keyof MaintenanceOrder, string> = Object.fromEntries(
  Object.entries(EXCEL_COLUMN_MAP).map(([k, v]) => [v, k])
) as Record<keyof MaintenanceOrder, string>;