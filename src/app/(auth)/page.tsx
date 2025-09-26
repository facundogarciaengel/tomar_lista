'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { FormField } from "@/components/forms/FormField";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useAuth({ redirectIfFound: true, redirectTo: "/dashboard" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginSchema) => {
    setMessage(null);
    try {
      const response = await login(data.email, data.password);
      setMessage(response.msg ?? "Autenticación correcta");
    } catch (error) {
      const err = error as Error & { message?: string };
      setMessage(err.message ?? "No fue posible iniciar sesión");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-white">Tomar Lista</h1>
          <p className="text-sm text-slate-300">Ingresa tus credenciales para continuar</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Email" error={errors.email} required>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
              placeholder="docente@colegio.com"
              autoComplete="email"
            />
          </FormField>
          <FormField label="Contraseña" error={errors.password} required>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </FormField>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:bg-blue-500"
          >
            {isSubmitting ? "Validando..." : "Ingresar"}
          </button>
        </form>
        {message ? <p className="text-center text-sm text-slate-200">{message}</p> : null}
      </div>
    </main>
  );
}
