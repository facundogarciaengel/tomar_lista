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
  claseId: z.string().min(1, "Selecciona una clase"),
  desde: z.string().optional(),
  hasta: z.string().optional()
});

type FormData = z.infer<typeof schema>;

type Clase = {
  id: number;
  nombre: string;
};

type ReporteClase = {
  total_sesiones: number;
  promedio_asistencias?: number;
  total_asistencias: number;
  total_ausencias: number;
  clase?: Clase;
};

type ReporteResponse = ReporteClase | { reporte: ReporteClase };

type ClasesResponse = Clase[] | { clases: Clase[] };

export default function ReporteClasePage() {
  useAuth({ redirectTo: "/" });
  const [clases, setClases] = useState<Clase[]>([]);
  const [reporte, setReporte] = useState<ReporteClase | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { claseId: "" }
  });

  useEffect(() => {
    async function loadClases() {
      try {
        const response = await apiClient.get<ClasesResponse>("/api/clases");
        const list = Array.isArray(response) ? response : response.clases ?? [];
        setClases(list);
      } catch (err) {
        setClases([]);
      }
    }

    loadClases();
  }, []);

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    try {
      const params: Record<string, string> = {};
      if (data.desde) params.desde = data.desde;
      if (data.hasta) params.hasta = data.hasta;
      const response = await apiClient.get<ReporteResponse>(
        `/api/reportes/asistencia/clase/${data.claseId}`,
        params
      );
      const res = "reporte" in response ? response.reporte : response;
      setReporte(res);
      if (!res) {
        setMessage("Sin datos");
      }
    } catch (err) {
      setMessage("No se pudo obtener el reporte");
      setReporte(null);
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Reporte por clase</h1>
        <p className="text-sm text-slate-300">Visualiza estadísticas de asistencia agrupadas por clase.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2 lg:grid-cols-3">
        <FormField label="Clase" required>
          <select
            {...register("claseId")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          >
            <option value="">Selecciona una clase</option>
            {clases.map((clase) => (
              <option key={clase.id} value={clase.id}>
                {clase.nombre}
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
            {reporte.clase?.nombre ?? clases.find((c) => String(c.id) === String(reporte?.clase?.id))?.nombre ?? "Clase"}
          </h2>
          <ul className="space-y-2 text-sm text-slate-100">
            <li>Sesiones registradas: {reporte.total_sesiones}</li>
            <li>Total de asistencias: {reporte.total_asistencias}</li>
            <li>Total de ausencias: {reporte.total_ausencias}</li>
            <li>
              Promedio de asistencia: {reporte.promedio_asistencias ? `${reporte.promedio_asistencias.toFixed(2)}%` : "N/D"}
            </li>
          </ul>
        </div>
      ) : message ? (
        <UiList items={[message]} />
      ) : null}
    </section>
  );
}
