import { useState, type FormEvent } from "react";
import { addOrder, type AddMaintenanceOrderInput } from "../services/api";

interface Props {
  slug: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY_FORM: AddMaintenanceOrderInput = {
  ordem: "",
  dataInicio: "",
  dataFim: "",
  localInstalacao: "",
  tipoOrdem: "",
  textoBreve: "",
  statusUsuario: "",
  denominacaoLocal: "",
  dataEntrada: "",
  centroTrabalho: "",
  tipoPrioridade: "",
  centroTrabResponsavel: "",
  prioridade: "",
};

const FORM_FIELDS: { key: keyof AddMaintenanceOrderInput; label: string; type?: string }[] = [
  { key: "ordem", label: "Ordem" },
  { key: "dataInicio", label: "Data Início", type: "date" },
  { key: "dataFim", label: "Data Fim", type: "date" },
  { key: "localInstalacao", label: "Local de Instalação" },
  { key: "tipoOrdem", label: "Tipo de Ordem" },
  { key: "textoBreve", label: "Texto Breve" },
  { key: "statusUsuario", label: "Status Usuário" },
  { key: "denominacaoLocal", label: "Denominação do Local" },
  { key: "dataEntrada", label: "Data da Entrada", type: "date" },
  { key: "centroTrabalho", label: "Centro de Trabalho" },
  { key: "tipoPrioridade", label: "Tipo de Prioridade" },
  { key: "centroTrabResponsavel", label: "Centro Trab. Responsável" },
  { key: "prioridade", label: "Prioridade" },
];

export default function AddOrderModal({ slug, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<AddMaintenanceOrderInput>({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: keyof AddMaintenanceOrderInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.ordem.trim()) {
      setError("O número da ordem é obrigatório.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await addOrder(slug, form);
      onSuccess();
    } catch {
      setError("Falha ao adicionar a ordem. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nova Ordem de Manutenção</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="error-state" style={{ padding: "0.75rem", marginBottom: "1rem" }}>
                <p>{error}</p>
              </div>
            )}

            <div className="form-grid">
              {FORM_FIELDS.map((field) => (
                <div
                  className={`form-group ${field.key === "textoBreve" ? "full-width" : ""}`}
                  key={field.key}
                >
                  <label htmlFor={`field-${field.key}`}>{field.label}</label>
                  <input
                    id={`field-${field.key}`}
                    type={field.type ?? "text"}
                    value={form[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.label}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              id="submit-order-btn"
            >
              {submitting ? "Salvando..." : "Salvar Ordem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
