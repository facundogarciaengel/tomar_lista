'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient, ApiError } from "@/lib/api";
import { FormField } from "@/components/forms/FormField";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  docente_id: z
    .string()
    .min(1, "Docente requerido")
    .transform((value) => Number(value))
    .pipe(z.number().int().positive("Docente inválido"))
});

type FormData = z.infer<typeof schema>;

type ClaseResponse = {
  id: number;
  nombre: string;
  docente_id: number;
};

type ClaseEnvelope = ClaseResponse | { clase: ClaseResponse };

export default function ClaseDetailPage() {
  useAuth({ redirectTo: "/" });
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const claseId = Number(params?.id);
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    async function loadClase() {
      try {
        const response = await apiClient.get<ClaseEnvelope>(`/api/clases/${claseId}`);
        const clase = "clase" in response ? response.clase : response;
        reset({ nombre: clase.nombre, docente_id: clase.docente_id });
      } catch (err) {
        const apiErr = err as ApiError;
        setMessage(apiErr.message);
      }
    }
    if (!Number.isNaN(claseId)) {
      loadClase();
    }
  }, [claseId, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setMessage(null);
      await apiClient.put(`/api/clases/${claseId}`, {
        nombre: data.nombre,
        docente_id: data.docente_id
      });
      setMessage("Clase actualizada correctamente");
    } catch (err) {
      const apiErr = err as ApiError;
      setMessage(apiErr.message);
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Detalle de clase</h1>
          <p className="text-sm text-slate-300">Edita el nombre y docente responsable de la clase.</p>
        </div>
        <button
          onClick={() => router.push(`/clases/${claseId}/alumnos`)}
          className="rounded-full border border-primary/40 px-4 py-2 text-sm font-medium text-primary hover:border-primary"
        >
          Gestionar inscripciones
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <FormField label="Nombre" error={errors.nombre} required>
          <input
            {...register("nombre")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          />
        </FormField>
        <FormField label="ID de docente" error={errors.docente_id} required>
          <input
            type="number"
            {...register("docente_id")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          />
        </FormField>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-500"
        >
          {isSubmitting ? "Guardando..." : "Actualizar"}
        </button>
      </form>

      {message ? <p className="text-sm text-slate-200">{message}</p> : null}
    </section>
  );
}
