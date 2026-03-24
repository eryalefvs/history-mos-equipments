import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";

function Header() {
  const location = useLocation();
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
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/equipamento/:slug" element={<HistoryPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
