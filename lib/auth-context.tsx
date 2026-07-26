"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { AuthResponse, Role } from "@/types";

interface AuthUser {
  email: string;
  fullName: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "booking_payments_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: AuthResponse = JSON.parse(stored);
      setToken(parsed.token);
      setUser({
        email: parsed.email,
        fullName: parsed.fullName,
        role: parsed.role,
      });
    }
    setIsLoading(false);
  }, []);

  function login(data: AuthResponse) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setToken(data.token);
    setUser({
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    });
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}