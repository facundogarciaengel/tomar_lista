'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRoleGuard } from "@/hooks/useAuth";
import { apiClient, ApiError } from "@/lib/api";
import { FormField } from "@/components/forms/FormField";

const schema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  rol: z.enum(["admin", "docente"])
});

type FormData = z.infer<typeof schema>;

type UsuarioResponse = {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "docente";
};

type UsuarioEnvelope = UsuarioResponse | { usuario: UsuarioResponse };

export default function UsuarioDetailPage() {
  useRoleGuard("admin");
  const params = useParams<{ id: string }>();
  const userId = Number(params?.id);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await apiClient.get<UsuarioEnvelope>(`/api/usuarios/${userId}`);
        const user = "usuario" in response ? response.usuario : response;
        reset({ nombre: user.nombre, email: user.email, rol: user.rol });
      } catch (err) {
        const apiErr = err as ApiError;
        setMessage(apiErr.message);
      }
    }

    if (!Number.isNaN(userId)) {
      loadUser();
    }
  }, [userId, reset]);

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    try {
      const response = await apiClient.put<UsuarioEnvelope>(`/api/usuarios/${userId}`, data);
      const updated = "usuario" in response ? response.usuario : response;
      reset({ nombre: updated.nombre, email: updated.email, rol: updated.rol });
      setMessage("Usuario actualizado correctamente");
    } catch (err) {
      const apiErr = err as ApiError;
      setMessage(apiErr.message);
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Editar usuario</h1>
        <p className="text-sm text-slate-300">Actualiza los datos básicos y el rol del usuario.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <FormField label="Nombre" error={errors.nombre} required>
          <input
            {...register("nombre")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          />
        </FormField>
        <FormField label="Email" error={errors.email} required>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          />
        </FormField>
        <FormField label="Rol" error={errors.rol} required>
          <select
            {...register("rol")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          >
            <option value="admin">Administrador</option>
            <option value="docente">Docente</option>
          </select>
        </FormField>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-500"
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
      </form>

      {message ? <p className="text-sm text-slate-200">{message}</p> : null}
    </section>
  );
}
