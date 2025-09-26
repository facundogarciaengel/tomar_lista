'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/auth";

type Role = "admin" | "docente";

type AuthUser = {
  id: number;
  nombre: string;
  email: string;
  rol: Role;
};

type AuthResponse = {
  msg: string;
  token: string;
  user: AuthUser;
};

type PerfilResponse = {
  msg: string;
  usuario: AuthUser;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error?: Error;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getToken());

  const handleUnauthorized = useCallback(() => {
    clearToken();
    setTokenState(null);
  }, []);

  useEffect(() => {
    apiClient.onUnauthorized = handleUnauthorized;
  }, [handleUnauthorized]);

  const fetcher = useCallback(async () => {
    const response = await apiClient.get<PerfilResponse>("/api/auth/perfil");
    return response.usuario;
  }, []);

  const { data, error, isLoading: perfilLoading, mutate } = useSWR<AuthUser | null>(
    token ? ["perfil", token] : null,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );

  const isLoading = perfilLoading;

  useEffect(() => {
    if (!token) {
      mutate(null, { revalidate: false });
    }
  }, [token, mutate]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await apiClient.post<AuthResponse>(
        "/api/auth/login",
        { email, password },
        { auth: false }
      );
      setToken(response.token);
      setTokenState(response.token);
      await mutate(response.user, { revalidate: false });
      return response;
    },
    [mutate]
  );

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    mutate(null, { revalidate: false });
  }, [mutate]);

  const refresh = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user: data ?? null,
      token,
      isLoading,
      error: error as Error | undefined,
      login,
      logout,
      refresh
    }),
    [data, token, isLoading, error, login, logout, refresh]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

type UseAuthOptions = {
  redirectTo?: string;
  allowedRoles?: Role[];
  redirectIfFound?: boolean;
};

export function useAuth(options?: UseAuthOptions) {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  const { redirectTo, allowedRoles, redirectIfFound } = options || {};
  const router = useRouter();
  const { user, isLoading } = ctx;

  useEffect(() => {
    if (isLoading) return;

    if (!user && redirectTo && !redirectIfFound) {
      router.replace(redirectTo);
    }

    if (user && redirectIfFound && redirectTo) {
      router.replace(redirectTo);
    }

    if (user && allowedRoles && !allowedRoles.includes(user.rol)) {
      router.replace(redirectTo ?? "/");
    }
  }, [user, isLoading, redirectTo, redirectIfFound, allowedRoles, router]);

  return ctx;
}

export function useRoleGuard(role: Role | Role[]) {
  const roles = Array.isArray(role) ? role : [role];
  return useAuth({ allowedRoles: roles, redirectTo: "/" });
}
