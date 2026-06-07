import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Dumbbell, ArrowRight } from "lucide-react";

function RegisterPage({ onGoToLogin }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.username);
      } else {
        const data = await response.json();
        setError(data.error || "Kayıt başarısız.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout fade-in">
      {/* Form Section (Left Side for Register) */}
      <div className="auth-form-area fade-in">
        <div className="auth-form-card">
          <h2 className="auth-form-title">Aramıza Katıl</h2>
          <p className="auth-form-sub">Saniyeler içinde hesabını oluştur ve başla.</p>

          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label className="form-label">Kullanıcı Adı</label>
              <input
                type="text"
                className="form-input"
                placeholder="Fitness sever"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

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
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-msg fade-in">{error}</div>}

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner">↻</span> : "Kayıt Ol"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-switch">
            Zaten hesabın var mı? <button onClick={onGoToLogin}>Giriş Yap</button>
          </div>
        </div>
      </div>

      {/* Brand Section (Right Side for Register) */}
      <div className="auth-brand" style={{ background: 'linear-gradient(200deg, #0a1a0a 0%, #081408 60%, #060d06 100%)' }}>
        <div className="brand-logo fade-in-2">
          <div className="brand-icon">
            <Dumbbell size={24} color="#0a140a" />
          </div>
          <span className="brand-name">FitTrack</span>
        </div>
        
        <h1 className="brand-tagline fade-in-2">
          Yeni Bir <br />
          <span className="hl">Başlangıç</span> <br />
          İçin Hazır Mısın?
        </h1>
        
        <p className="brand-desc fade-in-3">
          Bugün attığın küçük bir adım, yarın gurur duyacağın bir sonuca dönüşecek. FitTrack ile bu yolculukta yalnız değilsin.
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
