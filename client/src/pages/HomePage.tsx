import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchEquipments } from "../services/api";

export default function HomePage() {
  const [equipments, setEquipments] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEquipments()
      .then(setEquipments)
      .catch(() => setError("Falha ao carregar equipamentos."))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const slug = search.trim().toLowerCase().replace(/\s+/g, "");
    if (slug) navigate(`/equipamento/${slug}`);
  };

  const filtered = equipments.filter((eq) =>
    eq.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="hero">
        <h1>Histórico de OMs</h1>
        <p>
          Busque por equipamento ou escaneie o QR Code para visualizar o
          histórico de ordens de manutenção.
        </p>
      </section>

      <section className="search-section">
        <form className="search-box" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            placeholder="Digite o nome ou KM do equipamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
          <button type="submit">Buscar</button>
        </form>
      </section>

      <section className="equipment-section">
        <h2>Equipamentos Disponíveis</h2>

        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Carregando equipamentos...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>
              {search
                ? "Nenhum equipamento encontrado para essa busca."
                : "Nenhum equipamento cadastrado ainda. Adicione arquivos .xlsx na pasta data/ do servidor."}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="equipment-grid">
            {filtered.map((slug) => (
              <Link
                key={slug}
                to={`/equipamento/${slug}`}
                className="equipment-card"
              >
                <div className="card-icon">⚙️</div>
                <div className="card-name">{slug}</div>
                <div className="card-slug">/{slug}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
