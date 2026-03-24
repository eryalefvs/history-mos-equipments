import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchHistory, type MaintenanceOrder } from "../services/api";
import AddOrderModal from "../components/AddOrderModal";

const TABLE_COLUMNS: { key: keyof MaintenanceOrder; label: string }[] = [
  { key: "ordem", label: "Ordem" },
  { key: "dataInicio", label: "Data Início" },
  { key: "dataFim", label: "Data Fim" },
  { key: "localInstalacao", label: "Local Instalação" },
  { key: "tipoOrdem", label: "Tipo de Ordem" },
  { key: "textoBreve", label: "Texto Breve" },
  { key: "statusUsuario", label: "Status" },
  { key: "denominacaoLocal", label: "Denominação Local" },
  { key: "dataEntrada", label: "Data Entrada" },
  { key: "centroTrabalho", label: "Centro Trabalho" },
  { key: "tipoPrioridade", label: "Tipo Prioridade" },
  { key: "centroTrabResponsavel", label: "Centro Resp." },
  { key: "prioridade", label: "Prioridade" },
];

export default function HistoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [orders, setOrders] = useState<MaintenanceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const loadHistory = () => {
    if (!slug) return;
    setLoading(true);
    setError("");
    fetchHistory(slug)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, [slug]);

  const handleOrderAdded = () => {
    setShowModal(false);
    loadHistory();
  };

  return (
    <>
      <div className="history-header">
        <div className="history-header-left">
          <Link to="/" className="back-btn">
            ← Voltar
          </Link>
          <h1>
            Equipamento: <span>{slug}</span>
          </h1>
          {!loading && !error && (
            <span className="badge badge-count">
              {orders.length} ordem{orders.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          id="add-order-btn"
        >
          + Nova OM
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Carregando histórico...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>❌ {error}</p>
          <button className="btn btn-secondary" onClick={loadHistory} style={{ marginTop: "1rem" }}>
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>Nenhuma ordem de manutenção encontrada para este equipamento.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {TABLE_COLUMNS.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={`${order.ordem}-${idx}`}>
                  {TABLE_COLUMNS.map((col) => (
                    <td key={col.key}>{order[col.key] || "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && slug && (
        <AddOrderModal
          slug={slug}
          onClose={() => setShowModal(false)}
          onSuccess={handleOrderAdded}
        />
      )}
    </>
  );
}
