import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../api/services';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}

type Action =
  | { type: 'LOADING'; payload: boolean }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' };

const AuthContext = createContext<AuthContextType | null>(null);

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'LOADING': return { ...state, isLoading: action.payload };
    case 'AUTH_SUCCESS': return { user: action.payload.user, token: action.payload.token, isAuthenticated: true, isLoading: false };
    case 'LOGOUT': return { user: null, token: null, isAuthenticated: false, isLoading: false };
    default: return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('token');
      if (!token) { dispatch({ type: 'LOADING', payload: false }); return; }
      try {
        const res = await authApi.getMe();
        if (res.success && res.data) dispatch({ type: 'AUTH_SUCCESS', payload: { user: res.data, token } });
        else logout();
      } catch { logout(); }
    };
    restore();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    if (res.success && res.data) {
      localStorage.setItem('token', res.data.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data });
    }
  };

  const register = async (name: string, email: string, password: string, role?: string) => {
    const res = await authApi.register({ name, email, password, role });
    if (res.success && res.data) {
      localStorage.setItem('token', res.data.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data });
    }
  };

  const logout = () => { localStorage.removeItem('token'); dispatch({ type: 'LOGOUT' }); };

  return <AuthContext.Provider value={{ ...state, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
