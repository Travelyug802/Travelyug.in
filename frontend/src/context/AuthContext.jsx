import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [admin,   setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user  = localStorage.getItem('adminUser'); // ✅ was setItem (wrong method)
    if (token && user) {
      try { setAdmin(JSON.parse(user)); } catch { localStorage.clear(); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });

      const token = response.data?.data?.token;
      if (!token) throw new Error('Token not found');

      // ✅ Save with correct keys (adminToken / adminUser to match logout + useEffect)
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.data.admin)); // ✅ JSON not json

      setAdmin(response.data.data.admin);
      // ✅ Removed setIsLoggedIn(true) — it doesn't exist, isLoggedIn is derived from admin

      return true;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdmin(null);
  };

  return (
    <Ctx.Provider value={{ admin, loading, login, logout, isLoggedIn: !!admin }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);