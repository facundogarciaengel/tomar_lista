import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { fetchReporteClase } from '../services/api';
import Spinner from '../components/Spinner';

export default function Reportes() {
  const { user } = useAuth();
  const [claseId, setClaseId] = useState('');
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConsultar = async () => {
    if (!claseId) return;
    setLoading(true);
    try {
      const data = await fetchReporteClase(claseId, user.token);
      setReporte(data);
    } catch (err) {
      console.error('Error consultando reporte:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '1rem' }}>
      <h2>Reportes</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          placeholder="ID de clase"
          value={claseId}
          onChange={(e) => setClaseId(e.target.value)}
        />
        <button onClick={handleConsultar} style={{ marginLeft: '0.5rem' }}>
          Consultar
        </button>
      </div>
      {loading && <Spinner />}
      {reporte && (
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(reporte, null, 2)}
        </pre>
      )}
    </section>
  );
}
