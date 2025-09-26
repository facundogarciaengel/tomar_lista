'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

export default function NewClasePage() {
  useAuth({ redirectTo: "/" });
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    try {
      await apiClient.post("/api/clases", {
        nombre: data.nombre,
        docente_id: data.docente_id
      });
      router.push("/clases/list");
    } catch (err) {
      const apiErr = err as ApiError;
      setMessage(apiErr.message);
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Nueva clase</h1>
        <p className="text-sm text-slate-300">Define el nombre de la clase y asigna el docente responsable.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <FormField label="Nombre" error={errors.nombre} required>
          <input
            {...register("nombre")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          />
        </FormField>
        <FormField label="ID de docente" error={errors.docente_id} required help="Ingresa el ID del usuario docente.">
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
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
      </form>
      {message ? <p className="text-sm text-slate-200">{message}</p> : null}
    </section>
  );
}
