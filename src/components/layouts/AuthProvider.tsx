'use client';

import { AuthProvider as Provider } from "@/hooks/useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
