import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Dumbbell, LayoutDashboard, Utensils, CalendarDays, LogOut } from "lucide-react";

import MealsPage from "./pages/MealsPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";

function AppContent() {
  const { token, username, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [authPage, setAuthPage] = useState("login");

  if (!token) {
    return authPage === "login" ? (
      <LoginPage onGoToRegister={() => setAuthPage("register")} />
    ) : (
      <RegisterPage onGoToLogin={() => setAuthPage("login")} />
    );
  }

  // Menü Seçenekleri
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} className="nav-icon" /> },
    { id: "meals", label: "Öğünlerim", icon: <Utensils size={16} className="nav-icon" /> },
    { id: "workouts", label: "Antrenmanlarım", icon: <CalendarDays size={16} className="nav-icon" /> },
  ];

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon"><Dumbbell size={20} color="#071007" /></div>
          <div>
            <div className="logo-text">FitTrack</div>
            <div className="logo-sub">PERSONAL FITNESS</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Menü</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? "active" : ""}`}
              onClick={() => setCurrentPage(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-card">
            <div className="user-avatar">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="user-info">
              <div className="user-name">{username}</div>
              <div className="user-role">Üye</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Çıkış Yap">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "meals" && <MealsPage />}
        {currentPage === "workouts" && <WorkoutsPage />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;