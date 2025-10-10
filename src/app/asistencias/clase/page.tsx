'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { FormField } from "@/components/forms/FormField";
import { UiList } from "@/components/ui/UiList";

type Clase = {
  id: number;
  nombre: string;
};

type Asistencia = {
  id: number;
  alumno_id: number;
  fecha: string;
  presente: boolean;
  alumno?: {
    nombre: string;
  };
};

const schema = z.object({
  claseId: z.string().min(1, "Selecciona una clase"),
  fecha: z.string().optional(),
  desde: z.string().optional(),
  hasta: z.string().optional(),
  presente: z.enum(["", "true", "false"]).optional()
});

type FormData = z.infer<typeof schema>;

type AsistenciasResponse = Asistencia[] | { asistencias: Asistencia[] };

export default function AsistenciasClasePage() {
  useAuth({ redirectTo: "/" });
  const [clases, setClases] = useState<Clase[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { claseId: "" }
  });

  useEffect(() => {
    async function loadClases() {
      try {
        const response = await apiClient.get<Clase[] | { clases: Clase[] }>("/api/clases");
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
    if (!data.claseId) {
      setMessage("Selecciona una clase");
      return;
    }
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (data.fecha) params.fecha = data.fecha;
      if (data.desde) params.desde = data.desde;
      if (data.hasta) params.hasta = data.hasta;
      if (data.presente && data.presente !== "") params.presente = data.presente;
      const response = await apiClient.get<AsistenciasResponse>(`/api/asistencias/clase/${data.claseId}`, params);
      const list = Array.isArray(response) ? response : response.asistencias ?? [];
      setAsistencias(list);
      setMessage(list.length ? null : "Sin asistencias con estos filtros");
    } catch (err) {
      setMessage("No fue posible cargar las asistencias");
    } finally {
      setLoading(false);
    }
  };

  const selectedClass = watch("claseId");

  return (
    <section className="space-y-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Asistencias por clase</h1>
        <p className="text-sm text-slate-300">Filtra las asistencias según fecha, rango o estado.</p>
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

        <FormField label="Fecha exacta">
          <input
            type="date"
            {...register("fecha")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          />
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

        <FormField label="Estado">
          <select
            {...register("presente")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          >
            <option value="">Todos</option>
            <option value="true">Presentes</option>
            <option value="false">Ausentes</option>
          </select>
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

      {loading ? (
        <UiList items={["Buscando asistencias..."]} />
      ) : asistencias.length ? (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Alumno</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {asistencias.map((item) => (
                <tr key={item.id} className="text-slate-100">
                  <td className="px-4 py-3">{new Date(item.fecha).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{item.alumno?.nombre ?? `Alumno ${item.alumno_id}`}</td>
                  <td className="px-4 py-3">
                    <span className={item.presente ? "text-emerald-400" : "text-red-300"}>
                      {item.presente ? "Presente" : "Ausente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : selectedClass ? (
        <UiList items={[message ?? "Sin asistencias"]} />
      ) : null}

      {message && !asistencias.length ? <p className="text-sm text-slate-200">{message}</p> : null}
    </section>
  );
}
