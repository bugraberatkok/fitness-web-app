import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Dumbbell, ArrowRight, CheckCircle2 } from "lucide-react";

function LoginPage({ onGoToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.username);
      } else {
        setError("Email veya şifre hatalı.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout fade-in">
      {/* Brand Section */}
      <div className="auth-brand">
        <div className="brand-logo fade-in-2">
          <div className="brand-icon">
            <Dumbbell size={24} color="#0a140a" />
          </div>
          <span className="brand-name">FitTrack</span>
        </div>
        
        <h1 className="brand-tagline fade-in-2">
          Gelişimini <br />
          <span className="hl">Takip Et,</span> <br />
          Zirveye Ulaş.
        </h1>
        
        <p className="brand-desc fade-in-3">
          Antrenmanlarını ve beslenmeni tek bir yerden yönet. Sağlıklı yaşam yolculuğunda hedeflerine ulaşmak artık çok daha kolay.
        </p>

        <div className="brand-feats fade-in-3">
          <div className="brand-feat"><div className="feat-dot"></div> Detaylı kalori ve makro takibi</div>
          <div className="brand-feat"><div className="feat-dot"></div> Antrenman programı yönetimi</div>
          <div className="brand-feat"><div className="feat-dot"></div> Gelişim analizleri ve raporlar</div>
        </div>
      </div>

      {/* Form Section */}
      <div className="auth-form-area fade-in">
        <div className="auth-form-card">
          <h2 className="auth-form-title">Hoş Geldin</h2>
          <p className="auth-form-sub">Hesabına giriş yap ve kaldığın yerden devam et.</p>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Adresi</label>
              <input
                type="email"
                className="form-input"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Şifre</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-msg fade-in">{error}</div>}

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner">↻</span> : "Giriş Yap"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-switch">
            Hesabın yok mu? <button onClick={onGoToRegister}>Kayıt Ol</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
