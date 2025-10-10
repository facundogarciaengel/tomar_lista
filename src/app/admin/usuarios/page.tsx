import { redirect } from "next/navigation";

export default function AdminUsuariosIndexPage() {
  redirect("/admin/usuarios/list");
}
