'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { FormField } from "@/components/forms/FormField";
import { UiList } from "@/components/ui/UiList";

const schema = z.object({
  desde: z.string().optional(),
  hasta: z.string().optional()
});

type FormData = z.infer<typeof schema>;

type RankingItem = {
  alumno_id: number;
  nombre: string;
  ausencias: number;
};

type RankingResponse = RankingItem[] | { ranking: RankingItem[] };

export default function RankingAusenciasPage() {
  useAuth({ redirectTo: "/" });
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    try {
      const params: Record<string, string> = {};
      if (data.desde) params.desde = data.desde;
      if (data.hasta) params.hasta = data.hasta;
      const response = await apiClient.get<RankingResponse>("/api/reportes/ausencias/ranking", params);
      const list = Array.isArray(response) ? response : response.ranking ?? [];
      setRanking(list);
      if (!list.length) {
        setMessage("Sin ausencias registradas en el rango");
      }
    } catch (err) {
      setMessage("No se pudo obtener el ranking");
      setRanking([]);
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Ranking de ausencias</h1>
        <p className="text-sm text-slate-300">Ordena a los alumnos con más ausencias dentro de un rango de fechas.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
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
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-500"
        >
          Consultar
        </button>
      </form>

      {ranking.length ? (
        <UiList
          items={ranking.map((item, index) => `${index + 1}. ${item.nombre} — ${item.ausencias} ausencias`)}
          shimmer={false}
        />
      ) : message ? (
        <UiList items={[message]} />
      ) : null}
    </section>
  );
}
