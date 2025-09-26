import type { Metadata } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/layouts/AuthProvider";

export const metadata: Metadata = {
  title: "Tomar Lista",
  description: "Panel para gestionar alumnos, clases y asistencias"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
