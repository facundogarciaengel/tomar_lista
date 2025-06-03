import { useEffect, useState } from 'react';
import styles from './ClassSelect.module.css';
import Spinner from './Spinner';

/**
 * Props:
 *  - token: string (JWT)
 *  - onSelect: (claseId: number) => void
 */
export default function ClassSelect({ token, onSelect }) {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    import('../services/api')
      .then(({ fetchClases }) => fetchClases(token))
      .then((data) => {
        if (!mounted) return;
        setClases(data);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar las clases.');
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [token]);

  const handleChange = (e) => {
    const id = e.target.value;
    setSelected(id);
    onSelect(id);
  };

  if (loading) return <Spinner />;
  if (error)   return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.root}>
      <label htmlFor="clase-select">Clase:</label>
      <select
        id="clase-select"
        value={selected}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="">— Selecciona una clase —</option>
        {clases.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
