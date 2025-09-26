'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { FormField } from "@/components/forms/FormField";
import { UiList } from "@/components/ui/UiList";

const schema = z.object({
  alumnoId: z.string().min(1, "Selecciona un alumno"),
  desde: z.string().optional(),
  hasta: z.string().optional()
});

type FormData = z.infer<typeof schema>;

type Alumno = {
  id: number;
  nombre: string;
};

type ReporteAlumno = {
  total_asistencias: number;
  total_ausencias: number;
  porcentaje_asistencia?: number;
  alumno?: Alumno;
};

type ReporteResponse = ReporteAlumno | { reporte: ReporteAlumno };

export default function ReporteAlumnoPage() {
  useAuth({ redirectTo: "/" });
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [reporte, setReporte] = useState<ReporteAlumno | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { alumnoId: "" }
  });

  useEffect(() => {
    async function loadAlumnos() {
      try {
        const response = await apiClient.get<Alumno[] | { alumnos: Alumno[] }>("/api/alumnos");
        const list = Array.isArray(response) ? response : response.alumnos ?? [];
        setAlumnos(list);
      } catch (err) {
        setAlumnos([]);
      }
    }

    loadAlumnos();
  }, []);

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    try {
      const params: Record<string, string> = {};
      if (data.desde) params.desde = data.desde;
      if (data.hasta) params.hasta = data.hasta;
      const response = await apiClient.get<ReporteResponse>(
        `/api/reportes/asistencia/alumno/${data.alumnoId}`,
        params
      );
      const res = "reporte" in response ? response.reporte : response;
      setReporte(res);
      if (!res) {
        setMessage("Sin datos de asistencia");
      }
    } catch (err) {
      setMessage("No se pudo obtener el reporte");
      setReporte(null);
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Reporte por alumno</h1>
        <p className="text-sm text-slate-300">Consulta el resumen de asistencias para un alumno en un rango de fechas.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2 lg:grid-cols-3">
        <FormField label="Alumno" required>
          <select
            {...register("alumnoId")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          >
            <option value="">Selecciona un alumno</option>
            {alumnos.map((alumno) => (
              <option key={alumno.id} value={alumno.id}>
                {alumno.nombre}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Desde">
          <input
            type="date"
            {...register("desde")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          />
        </FormField>
        <FormField label="Hasta">
          <input
            type="date"
            {...register("hasta")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          />
        </FormField>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-blue-500"
          >
            Generar
          </button>
        </div>
      </form>

      {reporte ? (
        <div className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">
            {reporte.alumno?.nombre ?? alumnos.find((a) => String(a.id) === String(reporte?.alumno?.id))?.nombre ?? "Alumno"}
          </h2>
          <ul className="space-y-2 text-sm text-slate-100">
            <li>Asistencias: {reporte.total_asistencias}</li>
            <li>Ausencias: {reporte.total_ausencias}</li>
            <li>
              Porcentaje: {reporte.porcentaje_asistencia ? `${reporte.porcentaje_asistencia.toFixed(2)}%` : "N/D"}
            </li>
          </ul>
        </div>
      ) : message ? (
        <UiList items={[message]} />
      ) : null}
    </section>
  );
}
