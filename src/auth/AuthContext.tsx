import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
interface AuthContextType {
  authToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode; // تعریف نوع children به عنوان ReactNode
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const navigate = useNavigate();

  useEffect(() => {
    // بررسی اینکه آیا توکن معتبر است یا خیر
    if (authToken) {
      const decodedToken: any = jwtDecode(authToken);
      if (decodedToken.exp * 1000 < Date.now()) {
        // اگر توکن منقضی شده باشد، کاربر را لاگ اوت می‌کنیم
        logout();
      }
    }
  }, [authToken]);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    navigate('/'); // هدایت به صفحه اصلی بعد از ورود
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    navigate('/auth/signin'); // هدایت به صفحه ورود بعد از خروج
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
