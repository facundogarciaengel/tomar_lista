'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, ApiError } from "@/lib/api";
import { UiList } from "@/components/ui/UiList";

export type Clase = {
  id: number;
  nombre: string;
  docente_id: number;
  docente?: {
    nombre: string;
  };
};

export default function ClasesListPage() {
  useAuth({ redirectTo: "/" });
  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const response = await apiClient.get<Clase[] | { clases: Clase[] }>("/api/clases");
        const list = Array.isArray(response) ? response : response.clases ?? [];
        setClases(list);
      } catch (err) {
        const apiErr = err as ApiError;
        setError(apiErr.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Deseas eliminar esta clase?")) return;
    try {
      await apiClient.delete(`/api/clases/${id}`);
      setClases((prev) => prev.filter((clase) => clase.id !== id));
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message);
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Clases</h1>
          <p className="text-sm text-slate-300">Administra las clases disponibles e inscripciones de alumnos.</p>
        </div>
        <Link
          href="/clases/new"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-500"
        >
          Nueva clase
        </Link>
      </div>

      {loading ? (
        <UiList items={["Cargando clases..."]} />
      ) : clases.length ? (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Docente</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clases.map((clase) => (
                <tr key={clase.id} className="text-slate-100">
                  <td className="px-4 py-3 font-medium">{clase.nombre}</td>
                  <td className="px-4 py-3">{clase.docente?.nombre ?? `ID ${clase.docente_id}`}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/clases/${clase.id}`}
                        className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:border-white"
                      >
                        Editar
                      </Link>
                      <Link
                        href={`/clases/${clase.id}/alumnos`}
                        className="rounded-full border border-primary/40 px-3 py-1 text-xs text-primary hover:border-primary"
                      >
                        Inscriptos
                      </Link>
                      <button
                        onClick={() => handleDelete(clase.id)}
                        className="rounded-full border border-red-400/40 px-3 py-1 text-xs text-red-300 hover:border-red-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <UiList items={["Sin clases registradas"]} />
      )}

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </section>
  );
}
