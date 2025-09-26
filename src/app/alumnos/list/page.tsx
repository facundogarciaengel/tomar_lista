'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, ApiError } from "@/lib/api";
import { UiList } from "@/components/ui/UiList";

export type Alumno = {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
};

export default function AlumnosListPage() {
  useAuth({ redirectTo: "/" });
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get<Alumno[] | { alumnos: Alumno[] }>("/api/alumnos");
        const list = Array.isArray(response) ? response : response.alumnos ?? [];
        setAlumnos(list);
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
    if (!confirm("¿Seguro que deseas eliminar este alumno?")) return;
    try {
      await apiClient.delete(`/api/alumnos/${id}`);
      setAlumnos((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message);
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Alumnos</h1>
          <p className="text-sm text-slate-300">Gestiona los datos de tus alumnos y consulta sus asistencias.</p>
        </div>
        <Link
          href="/alumnos/new"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-500"
        >
          Nuevo alumno
        </Link>
      </div>

      {loading ? (
        <UiList items={["Cargando alumnos..."]} />
      ) : alumnos.length ? (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {alumnos.map((alumno) => (
                <tr key={alumno.id} className="text-slate-100">
                  <td className="px-4 py-3 font-medium">{alumno.nombre}</td>
                  <td className="px-4 py-3">{alumno.email}</td>
                  <td className="px-4 py-3">{alumno.telefono ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/alumnos/${alumno.id}`}
                        className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:border-white"
                      >
                        Ver
                      </Link>
                      <button
                        onClick={() => handleDelete(alumno.id)}
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
        <UiList items={["Sin alumnos cargados"]} />
      )}

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </section>
  );
}
