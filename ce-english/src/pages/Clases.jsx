// src/pages/Clases.jsx
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { fetchClases, fetchUsuario } from '../services/api';
import ClassList from '../components/ClassList';
import Spinner from '../components/Spinner';

export default function Clases() {
  const { user } = useAuth();
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);

    const load = async () => {
      try {
        const lista = await fetchClases(user.token);
        // Por cada clase, traemos el nombre del docente
        const conNombres = await Promise.all(
          lista.map(async (c) => {
            let nombreDocente = '—';
            if (c.docente_id) {
              const docente = await fetchUsuario(c.docente_id, user.token);
              nombreDocente = docente.nombre;
            }
            return { ...c, docente: nombreDocente };
          })
        );
        setClases(conNombres);
      } catch (err) {
        console.error('Error cargando clases:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  return (
    <section style={{ padding: '1rem' }}>
      <h2>Clases</h2>
      {loading ? <Spinner /> : <ClassList clases={clases} />}
    </section>
  );
}
