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
  fecha: z.string().min(4, "Selecciona una fecha")
});

type FormData = z.infer<typeof schema>;

type Ausencia = {
  id: number;
  nombre: string;
  clase?: string;
};

type AusenciasResponse = Ausencia[] | { ausentes: Ausencia[] };

export default function AusenciasFechaPage() {
  useAuth({ redirectTo: "/" });
  const [ausentes, setAusentes] = useState<Ausencia[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fecha: new Date().toISOString().split("T")[0] }
  });

  useEffect(() => {
    handleSubmit(onSubmit)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    try {
      const response = await apiClient.get<AusenciasResponse>(
        "/api/reportes/ausencias/fecha",
        { fecha: data.fecha }
      );
      const list = Array.isArray(response) ? response : response.ausentes ?? [];
      setAusentes(list);
      if (!list.length) {
        setMessage("Sin ausencias para la fecha");
      }
    } catch (err) {
      setMessage("No se pudo obtener el listado de ausentes");
      setAusentes([]);
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Ausencias por fecha</h1>
        <p className="text-sm text-slate-300">Lista a todos los alumnos que faltaron en cualquier clase en la fecha seleccionada.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <FormField label="Fecha" required>
          <input
            type="date"
            {...register("fecha")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          />
        </FormField>
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-500"
        >
          Consultar
        </button>
      </form>

      {ausentes.length ? (
        <UiList
          items={ausentes.map((item) => `${item.nombre}${item.clase ? ` · ${item.clase}` : ""}`)}
          shimmer={false}
        />
      ) : message ? (
        <UiList items={[message]} />
      ) : null}
    </section>
  );
}
