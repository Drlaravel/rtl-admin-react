import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
interface AuthContextType {
  authToken: string | null;
  userRole: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      try {
        const decodedToken: any = jwtDecode(authToken);

        if (decodedToken.exp * 1000 < Date.now()) {
          logout();  // اگر توکن منقضی شده باشد
        }
      } catch (error) {
        console.error('Invalid token', error);
        logout();  // اگر توکن نامعتبر است
      }
    }
  }, [authToken]);

  const login = (token: string, role: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);

    setAuthToken(token);
    setUserRole(role);  // تنظیم نقش کاربر

    navigate('/');  // هدایت به صفحه اصلی
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setAuthToken(null);
    setUserRole(null);
    navigate('/auth/signin');  // هدایت به صفحه ورود
  };

  return (
    <AuthContext.Provider value={{ authToken, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
