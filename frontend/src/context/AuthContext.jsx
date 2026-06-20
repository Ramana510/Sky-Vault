import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const getUserFromStorage = () => {
  const stored = localStorage.getItem('sky-vault-user');
  return stored ? JSON.parse(stored) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromStorage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sky-vault-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sky-vault-user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
