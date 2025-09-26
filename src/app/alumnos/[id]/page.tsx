'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient, ApiError } from "@/lib/api";
import { FormField } from "@/components/forms/FormField";
import { useAuth } from "@/hooks/useAuth";
import { UiList } from "@/components/ui/UiList";

const schema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  telefono: z.string().optional().or(z.literal(""))
});

type FormData = z.infer<typeof schema>;

type Asistencia = {
  id: number;
  fecha: string;
  clase_id: number;
  presente: boolean;
  clase?: {
    nombre: string;
  };
};

type Clase = {
  id: number;
  nombre: string;
};

type AlumnoResponse = {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
};

type AsistenciasResponse = Asistencia[] | { asistencias: Asistencia[] };

type ClaseResponse = Clase | { clase: Clase };

export default function AlumnoDetailPage() {
  useAuth({ redirectTo: "/" });
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const alumnoId = Number(params?.id);
  const [message, setMessage] = useState<string | null>(null);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loadingAsist, setLoadingAsist] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    async function loadAlumno() {
      try {
        const response = await apiClient.get<AlumnoResponse | { alumno: AlumnoResponse }>(`/api/alumnos/${alumnoId}`);
        const alumno = "alumno" in response ? response.alumno : response;
        reset({ nombre: alumno.nombre, email: alumno.email, telefono: alumno.telefono ?? "" });
      } catch (err) {
        const apiErr = err as ApiError;
        setMessage(apiErr.message);
      }
    }

    async function loadAsistencias() {
      try {
        setLoadingAsist(true);
        const response = await apiClient.get<AsistenciasResponse>(`/api/asistencias/alumno/${alumnoId}`);
        const asistList = Array.isArray(response) ? response : response.asistencias ?? [];
        setAsistencias(asistList);
      } catch (err) {
        setAsistencias([]);
      } finally {
        setLoadingAsist(false);
      }
    }

    if (!Number.isNaN(alumnoId)) {
      loadAlumno();
      loadAsistencias();
    }
  }, [alumnoId, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setMessage(null);
      await apiClient.put(`/api/alumnos/${alumnoId}`, {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono || undefined
      });
      setMessage("Alumno actualizado correctamente");
    } catch (err) {
      const apiErr = err as ApiError;
      setMessage(apiErr.message);
    }
  };

  const navigateToClase = async (claseId: number) => {
    try {
      const response = await apiClient.get<ClaseResponse>(`/api/clases/${claseId}`);
      const clase = "clase" in response ? response.clase : response;
      router.push(`/clases/${clase.id}`);
    } catch (err) {
      router.push(`/clases/${claseId}`);
    }
  };

  return (
    <section className="space-y-8 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Detalle del alumno</h1>
        <p className="text-sm text-slate-300">Actualiza los datos y revisa su historial de asistencias.</p>
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
        <FormField label="Teléfono" error={errors.telefono}>
          <input
            {...register("telefono")}
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

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Asistencias</h2>
        {loadingAsist ? (
          <UiList items={["Cargando asistencias..."]} />
        ) : asistencias.length ? (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Clase</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {asistencias.map((item) => (
                  <tr key={item.id} className="text-slate-100">
                    <td className="px-4 py-3">{new Date(item.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigateToClase(item.clase_id)}
                        className="text-primary hover:underline"
                      >
                        {item.clase?.nombre ?? `Clase ${item.clase_id}`}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={item.presente ? "text-emerald-400" : "text-red-300"}
                      >
                        {item.presente ? "Presente" : "Ausente"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <UiList items={["Sin asistencias registradas"]} />
        )}
      </div>

      {message ? <p className="text-sm text-slate-200">{message}</p> : null}
    </section>
  );
}
