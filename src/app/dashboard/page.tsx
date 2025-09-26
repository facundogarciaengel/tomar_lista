'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import { UiCardGrid } from "@/components/ui/UiCards";
import { UiList } from "@/components/ui/UiList";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, ApiError } from "@/lib/api";

type Asistencia = {
  id: number;
  alumno_id: number;
  clase_id: number;
  fecha: string;
  presente: boolean;
};

type Clase = {
  id: number;
  nombre: string;
};

type Alumno = {
  id: number;
  nombre: string;
};

export default function DashboardPage() {
  const { user, isLoading } = useAuth({ redirectTo: "/" });
  const [todayAttendance, setTodayAttendance] = useState<{ present: number; absent: number }>({ present: 0, absent: 0 });
  const [latestClasses, setLatestClasses] = useState<Clase[]>([]);
  const [latestStudents, setLatestStudents] = useState<Alumno[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setError(null);
        const today = new Date().toISOString().split("T")[0];
        const asistenciasResponse = await apiClient.get<Asistencia[] | { asistencias: Asistencia[] }>(
          "/api/asistencias"
        );
        const asistencias = Array.isArray(asistenciasResponse)
          ? asistenciasResponse
          : asistenciasResponse.asistencias ?? [];
        const todays = asistencias.filter((a) => a.fecha?.startsWith(today));
        const present = todays.filter((a) => a.presente).length;
        const absent = todays.length - present;
        setTodayAttendance({ present, absent });
      } catch (err) {
        const apiErr = err as ApiError;
        if (apiErr.status !== 404) {
          setError(apiErr.message);
        }
      }

      try {
        const classesResponse = await apiClient.get<Clase[] | { clases: Clase[] }>("/api/clases");
        const clases = Array.isArray(classesResponse) ? classesResponse : classesResponse.clases ?? [];
        setLatestClasses(clases.slice(0, 3));
      } catch (err) {
        setLatestClasses([]);
      }

      try {
        const studentsResponse = await apiClient.get<Alumno[] | { alumnos: Alumno[] }>("/api/alumnos");
        const alumnos = Array.isArray(studentsResponse) ? studentsResponse : studentsResponse.alumnos ?? [];
        setLatestStudents(alumnos.slice(0, 5));
      } catch (err) {
        setLatestStudents([]);
      }
    }

    if (!user) return;
    loadData();
  }, [user]);

  if (isLoading && !user) {
    return <div className="p-10 text-sm text-slate-200">Verificando sesión...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-10 px-6 py-10">
      <Hero
        title={`Hola, ${user.nombre}`}
        subtitle="Revisa el estado de las asistencias y gestiona tus clases en segundos."
        cta={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/asistencias/registrar"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-500"
            >
              Registrar asistencia
            </Link>
            <Link
              href="/reportes/ausencias"
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white/90 hover:border-white"
            >
              Ver reportes
            </Link>
          </div>
        }
      />

      <UiCardGrid
        items={[
          {
            title: "Presentes hoy",
            description: `${todayAttendance.present} alumnos marcaron asistencia`,
            accent: "#22c55e"
          },
          {
            title: "Ausentes hoy",
            description: `${todayAttendance.absent} alumnos sin asistencia registrada`,
            accent: "#f97316"
          },
          {
            title: "Clases activas",
            description: `${latestClasses.length} clases registradas recientemente`
          }
        ]}
      />

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Clases recientes</h2>
            <Link href="/clases/list" className="text-sm text-primary">
              Ver todas
            </Link>
          </div>
          {latestClasses.length > 0 ? (
            <div className="space-y-3">
              {latestClasses.map((clase) => (
                <div key={clase.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-white">{clase.nombre}</p>
                </div>
              ))}
            </div>
          ) : (
            <UiList items={["Sin clases registradas"]} />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Alumnos recientes</h2>
            <Link href="/alumnos/list" className="text-sm text-primary">
              Ver todos
            </Link>
          </div>
          {latestStudents.length > 0 ? (
            <div className="space-y-3">
              {latestStudents.map((alumno) => (
                <div key={alumno.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-white">{alumno.nombre}</p>
                </div>
              ))}
            </div>
          ) : (
            <UiList items={["Sin alumnos registrados"]} />
          )}
        </div>
      </section>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
