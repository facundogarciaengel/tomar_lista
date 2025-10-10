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
  claseId: z.string().min(1, "Selecciona una clase")
});

type FormData = z.infer<typeof schema>;

type Clase = {
  id: number;
  nombre: string;
};

type MensualItem = {
  mes: string;
  asistencias: number;
  ausencias: number;
};

type MensualResponse = MensualItem[] | { estadisticas: MensualItem[] };

type ClasesResponse = Clase[] | { clases: Clase[] };

export default function ReporteMensualPage() {
  useAuth({ redirectTo: "/" });
  const [clases, setClases] = useState<Clase[]>([]);
  const [datos, setDatos] = useState<MensualItem[]>([]);
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
      const response = await apiClient.get<MensualResponse>(
        `/api/reportes/asistencia/mensual/clase/${data.claseId}`
      );
      const list = Array.isArray(response) ? response : response.estadisticas ?? [];
      setDatos(list);
      if (!list.length) {
        setMessage("Sin datos mensuales");
      }
    } catch (err) {
      setDatos([]);
      setMessage("No se pudo obtener el reporte mensual");
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Reporte mensual por clase</h1>
        <p className="text-sm text-slate-300">Analiza la asistencia mes a mes para detectar tendencias.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
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
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-500"
        >
          Consultar
        </button>
      </form>

      {datos.length ? (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Mes</th>
                <th className="px-4 py-3">Asistencias</th>
                <th className="px-4 py-3">Ausencias</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {datos.map((item) => (
                <tr key={item.mes} className="text-slate-100">
                  <td className="px-4 py-3 font-medium">{item.mes}</td>
                  <td className="px-4 py-3">{item.asistencias}</td>
                  <td className="px-4 py-3">{item.ausencias}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : message ? (
        <UiList items={[message]} />
      ) : null}
    </section>
  );
}
