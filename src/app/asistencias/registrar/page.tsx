'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, ApiError } from "@/lib/api";
import { FormField } from "@/components/forms/FormField";
import { UiList } from "@/components/ui/UiList";

const schema = z.object({
  alumno_id: z
    .string()
    .min(1, "Selecciona un alumno")
    .transform((value) => Number(value))
    .pipe(z.number().positive()),
  clase_id: z
    .string()
    .min(1, "Selecciona una clase")
    .transform((value) => Number(value))
    .pipe(z.number().positive()),
  fecha: z.string().min(8, "Selecciona una fecha"),
  presente: z.boolean()
});

type FormData = z.infer<typeof schema>;

type Alumno = {
  id: number;
  nombre: string;
};

type Clase = {
  id: number;
  nombre: string;
};

export default function RegistrarAsistenciaPage() {
  useAuth({ redirectTo: "/" });
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [clases, setClases] = useState<Clase[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fecha: new Date().toISOString().split("T")[0],
      presente: true
    }
  });

  useEffect(() => {
    async function loadLists() {
      try {
        const alumnosResponse = await apiClient.get<Alumno[] | { alumnos: Alumno[] }>("/api/alumnos");
        const listAlumnos = Array.isArray(alumnosResponse) ? alumnosResponse : alumnosResponse.alumnos ?? [];
        setAlumnos(listAlumnos);
      } catch (err) {
        setAlumnos([]);
      }

      try {
        const clasesResponse = await apiClient.get<Clase[] | { clases: Clase[] }>("/api/clases");
        const listClases = Array.isArray(clasesResponse) ? clasesResponse : clasesResponse.clases ?? [];
        setClases(listClases);
      } catch (err) {
        setClases([]);
      }
    }

    loadLists();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setMessage(null);
      await apiClient.post("/api/asistencias", data);
      setMessage("Asistencia registrada correctamente");
    } catch (err) {
      const apiErr = err as ApiError;
      setMessage(apiErr.message);
    }
  };

  return (
    <section className="space-y-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Registrar asistencia</h1>
        <p className="text-sm text-slate-300">Completa la asistencia de un alumno para una clase específica.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <FormField label="Alumno" error={errors.alumno_id} required>
          {alumnos.length ? (
            <select
              {...register("alumno_id")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
            >
              <option value="">Selecciona un alumno</option>
              {alumnos.map((alumno) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.nombre}
                </option>
              ))}
            </select>
          ) : (
            <UiList items={["Sin alumnos disponibles"]} />
          )}
        </FormField>

        <FormField label="Clase" error={errors.clase_id} required>
          {clases.length ? (
            <select
              {...register("clase_id")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
            >
              <option value="">Selecciona una clase</option>
              {clases.map((clase) => (
                <option key={clase.id} value={clase.id}>
                  {clase.nombre}
                </option>
              ))}
            </select>
          ) : (
            <UiList items={["Sin clases disponibles"]} />
          )}
        </FormField>

        <FormField label="Fecha" error={errors.fecha} required>
          <input
            type="date"
            {...register("fecha")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/60"
          />
        </FormField>

        <FormField label="Estado" required>
          <div className="flex gap-4 text-sm text-white">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="true"
                {...register("presente", {
                  onChange: (event) => setValue("presente", event.target.value === "true")
                })}
                defaultChecked
              />
              Presente
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="false"
                {...register("presente", {
                  onChange: (event) => setValue("presente", event.target.value === "true")
                })}
              />
              Ausente
            </label>
          </div>
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-500"
        >
          {isSubmitting ? "Registrando..." : "Registrar"}
        </button>
      </form>

      {message ? <p className="text-sm text-slate-200">{message}</p> : null}
    </section>
  );
}
