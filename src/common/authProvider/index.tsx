"use client";

import { Admin } from "@/interfaces";
import { useRouter } from "next/navigation";
import { createContext, FC, PropsWithChildren, useCallback, useEffect, useState } from "react";

const STORAGE_KEYS = {
  token: "token",
  admin: "admin",
};

type AuthContextType = {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  admin: null,
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem(STORAGE_KEYS.token);
    const a = localStorage.getItem(STORAGE_KEYS.admin);
    if (t) setToken(t);
    if (a) {
      try {
        setAdmin(JSON.parse(a));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.admin);
      }
    }
    setMounted(true);
  }, []);

  const login = useCallback((newToken: string, newAdmin: Admin) => {
    localStorage.setItem(STORAGE_KEYS.token, newToken);
    localStorage.setItem(STORAGE_KEYS.admin, JSON.stringify(newAdmin));
    setToken(newToken);
    setAdmin(newAdmin);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.admin);
    setToken(null);
    setAdmin(null);
    router.push("/auth/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        login,
        logout,
      }}
    >
      {mounted ? children : null}
    </AuthContext.Provider>
  );
};
