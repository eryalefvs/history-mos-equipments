import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";

function getInitialTheme(): "light" | "dark" {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

function Header() {
  const location = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <div className="header-logo-icon">🔧</div>
          <div className="header-logo-text">
            Histórico <span>OMs</span>
          </div>
        </Link>
        <nav className="header-nav">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Início
          </Link>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === "dark" ? "Mudar para claro" : "Mudar para escuro"}
            id="theme-toggle-btn"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/equipamento/:slug" element={<HistoryPage />} />
        </Routes>
      </main>
    </HashRouter>
  );
}
