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
  fecha: z.string().min(4, "Selecciona una fecha")
});

type FormData = z.infer<typeof schema>;

type Clase = {
  id: number;
  nombre: string;
};

type ResumenFecha = {
  clase?: Clase;
  presentes: { id: number; nombre: string }[];
  ausentes: { id: number; nombre: string }[];
};

type ResumenResponse = ResumenFecha | { reporte: ResumenFecha };

type ClasesResponse = Clase[] | { clases: Clase[] };

export default function ReporteFechaPage() {
  useAuth({ redirectTo: "/" });
  const [clases, setClases] = useState<Clase[]>([]);
  const [resumen, setResumen] = useState<ResumenFecha | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fecha: new Date().toISOString().split("T")[0], claseId: "" }
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
      const response = await apiClient.get<ResumenResponse>(
        `/api/reportes/asistencia/fecha/clase/${data.claseId}`,
        { fecha: data.fecha }
      );
      const res = "reporte" in response ? response.reporte : response;
      setResumen(res);
      if (!res.presentes.length && !res.ausentes.length) {
        setMessage("No hay registros en la fecha seleccionada");
      }
    } catch (err) {
      setMessage("No se pudo cargar el resumen");
      setResumen(null);
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Presentes y ausentes por fecha</h1>
        <p className="text-sm text-slate-300">Identifica quién asistió o faltó a una clase en una fecha específica.</p>
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
        <FormField label="Fecha" required>
          <input
            type="date"
            {...register("fecha")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          />
        </FormField>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-blue-500"
          >
            Consultar
          </button>
        </div>
      </form>

      {resumen ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Presentes</h2>
            {resumen.presentes.length ? (
              <UiList items={resumen.presentes.map((item) => item.nombre)} shimmer={false} />
            ) : (
              <UiList items={["Sin presentes"]} />
            )}
          </div>
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Ausentes</h2>
            {resumen.ausentes.length ? (
              <UiList items={resumen.ausentes.map((item) => item.nombre)} shimmer={false} />
            ) : (
              <UiList items={["Sin ausentes"]} />
            )}
          </div>
        </div>
      ) : message ? (
        <UiList items={[message]} />
      ) : null}
    </section>
  );
}
