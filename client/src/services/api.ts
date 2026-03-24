const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

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

export async function fetchEquipments(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/equipments`);
  if (!res.ok) throw new Error("Falha ao buscar equipamentos");
  const data = await res.json();
  return data.equipments;
}

export async function fetchHistory(slug: string): Promise<MaintenanceOrder[]> {
  const res = await fetch(`${API_BASE}/api/history/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Equipamento não encontrado");
    throw new Error("Falha ao buscar histórico");
  }
  const data = await res.json();
  return data.orders;
}

export async function addOrder(
  slug: string,
  order: AddMaintenanceOrderInput
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/history/${encodeURIComponent(slug)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error("Falha ao adicionar ordem");
}
