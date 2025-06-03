// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  // Inicializa directamente leyendo localStorage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ce_user');
    return stored ? JSON.parse(stored) : null;
  });

  /**
   * Guarda login: espera { token, user }
   * Combina ambos en un solo objeto y lo persiste
   */
  const login = ({ token, user: userData }) => {
    const merged = { ...userData, token };
    setUser(merged);
    localStorage.setItem('ce_user', JSON.stringify(merged));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ce_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
