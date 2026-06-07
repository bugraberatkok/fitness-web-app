import { createContext, useContext, useState } from "react";

// AuthContext: token ve kullanıcı bilgisini tüm uygulamada erişilebilir kılar
// React Context = global state, prop drilling olmadan her component erişebilir
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // localStorage'dan token al (sayfa yenilenince kaybolmasın)
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  // Giriş yapıldığında token'ı kaydet
  function login(newToken, newUsername) {
    setToken(newToken);
    setUsername(newUsername);
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
  }

  // Çıkış yapıldığında her şeyi temizle
  function logout() {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  }

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook'u: herhangi bir component'te { token, username, login, logout } alır
export function useAuth() {
  return useContext(AuthContext);
}
