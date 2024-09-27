import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  authToken: string | null;
  user: { name: string; role: string } | null;
  login: (token: string, role: string, name: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [user, setUser] = useState<{ name: string; role: string } | null>(
    localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      try {
        const decodedToken: any = jwtDecode(authToken);

        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
        }
      } catch (error) {
        console.error('Invalid token', error);
        logout();
      }
    }
  }, [authToken]);

  const login = (token: string, role: string, name: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify({ name, role }));

    setAuthToken(token);
    setUser({ name, role });

    navigate('/');
  };



  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
    navigate('/auth/signin');
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
