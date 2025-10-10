'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRoleGuard } from "@/hooks/useAuth";
import { apiClient, ApiError } from "@/lib/api";
import { UiList } from "@/components/ui/UiList";

export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "docente";
};

type UsuariosResponse = Usuario[] | { usuarios: Usuario[] };

export default function UsuariosAdminListPage() {
  useRoleGuard("admin");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const response = await apiClient.get<UsuariosResponse>("/api/usuarios");
        const list = Array.isArray(response) ? response : response.usuarios ?? [];
        setUsuarios(list);
      } catch (err) {
        const apiErr = err as ApiError;
        setMessage(apiErr.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await apiClient.delete(`/api/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
    } catch (err) {
      const apiErr = err as ApiError;
      setMessage(apiErr.message);
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Usuarios</h1>
          <p className="text-sm text-slate-300">Gestiona los usuarios del sistema y asigna roles.</p>
        </div>
      </div>

      {loading ? (
        <UiList items={["Cargando usuarios..."]} />
      ) : usuarios.length ? (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="text-slate-100">
                  <td className="px-4 py-3 font-medium">{usuario.nombre}</td>
                  <td className="px-4 py-3">{usuario.email}</td>
                  <td className="px-4 py-3 capitalize">{usuario.rol}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/usuarios/${usuario.id}`}
                        className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80 hover:border-white"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(usuario.id)}
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
        <UiList items={["Sin usuarios registrados"]} />
      )}

      {message ? <p className="text-sm text-red-400">{message}</p> : null}
    </section>
  );
}
