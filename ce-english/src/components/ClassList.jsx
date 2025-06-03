// src/components/ClassList.jsx
import { Link } from 'react-router-dom';
import styles from './ClassList.module.css';

export default function ClassList({ clases = [] }) {
  if (clases.length === 0) {
    return <p className={styles.empty}>No hay clases asignadas.</p>;
  }
  return (
    <div className={styles.wrapper}>
      <table className={styles.root}>
        <thead>
          <tr>
            <th>Clase</th>
            <th>Docente</th>
            <th className={styles.actionsHeader}></th>
          </tr>
        </thead>
        <tbody>
          {clases.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.docente}</td>
              <td className={styles.actions}>
                <Link
                  to={`/asistencia?clase=${c.id}`}
                  className={styles.btn}
                >
                  Tomar asistencia
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
