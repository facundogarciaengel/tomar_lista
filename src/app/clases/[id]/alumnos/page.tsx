'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, ApiError } from "@/lib/api";
import { FormField } from "@/components/forms/FormField";
import { UiList } from "@/components/ui/UiList";

type Alumno = {
  id: number;
  nombre: string;
  email: string;
};

type Clase = {
  id: number;
  nombre: string;
};

const schema = z.object({
  alumno_id: z
    .string()
    .min(1, "Alumno requerido")
    .transform((value) => Number(value))
    .pipe(z.number().positive())
});

type FormData = z.infer<typeof schema>;

type ClaseResponse = Clase | { clase: Clase };

type AlumnosResponse = Alumno[] | { alumnos: Alumno[] };

export default function ClaseAlumnosPage() {
  useAuth({ redirectTo: "/" });
  const params = useParams<{ id: string }>();
  const claseId = Number(params?.id);
  const [clase, setClase] = useState<Clase | null>(null);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
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
    async function loadData() {
      try {
        const claseResponse = await apiClient.get<ClaseResponse>(`/api/clases/${claseId}`);
        const claseData = "clase" in claseResponse ? claseResponse.clase : claseResponse;
        setClase(claseData);
      } catch (err) {
        setClase(null);
      }

      try {
        setLoading(true);
        const response = await apiClient.get<AlumnosResponse>(`/api/clases/${claseId}/alumnos`);
        const list = Array.isArray(response) ? response : response.alumnos ?? [];
        setAlumnos(list);
      } catch (err) {
        setAlumnos([]);
      } finally {
        setLoading(false);
      }
    }

    if (!Number.isNaN(claseId)) {
      loadData();
    }
  }, [claseId]);

  const onSubmit = async (data: FormData) => {
    try {
      setMessage(null);
      await apiClient.post(`/api/clases/${claseId}/alumnos`, {
        alumno_id: data.alumno_id
      });
      reset();
      const response = await apiClient.get<AlumnosResponse>(`/api/clases/${claseId}/alumnos`);
      const list = Array.isArray(response) ? response : response.alumnos ?? [];
      setAlumnos(list);
      setMessage("Alumno inscripto correctamente");
    } catch (err) {
      const apiErr = err as ApiError;
      setMessage(apiErr.message);
    }
  };

  const handleRemove = async (alumnoId: number) => {
    if (!confirm("¿Eliminar al alumno de la clase?")) return;
    try {
      await apiClient.delete(`/api/clases/${claseId}/alumnos/${alumnoId}`);
      setAlumnos((prev) => prev.filter((item) => item.id !== alumnoId));
    } catch (err) {
      const apiErr = err as ApiError;
      setMessage(apiErr.message);
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Inscripciones de la clase</h1>
        <p className="text-sm text-slate-300">
          {clase ? `Gestiona los alumnos de ${clase.nombre}.` : "Selecciona alumnos para la clase."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <FormField label="ID de alumno" error={errors.alumno_id} required help="Ingresa el ID numérico del alumno.">
          <input
            type="number"
            {...register("alumno_id")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          />
        </FormField>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-500"
        >
          {isSubmitting ? "Agregando..." : "Agregar alumno"}
        </button>
      </form>

      {loading ? (
        <UiList items={["Cargando inscriptos..."]} />
      ) : alumnos.length ? (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {alumnos.map((alumno) => (
                <tr key={alumno.id} className="text-slate-100">
                  <td className="px-4 py-3 font-medium">{alumno.nombre}</td>
                  <td className="px-4 py-3">{alumno.email}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRemove(alumno.id)}
                      className="rounded-full border border-red-400/40 px-3 py-1 text-xs text-red-300 hover:border-red-300"
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <UiList items={["Sin alumnos inscriptos"]} />
      )}

      {message ? <p className="text-sm text-slate-200">{message}</p> : null}
    </section>
  );
}
