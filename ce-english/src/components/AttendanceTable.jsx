import styles from './AttendanceTable.module.css';

export default function AttendanceTable({ alumnos }) {
  return (
    <table className={styles.root}>
      <thead>
        <tr>
          <th>Alumno</th>
          <th>Presente</th>
        </tr>
      </thead>
      <tbody>
        {alumnos.map((a) => (
          <tr key={a.id}>
            <td>{a.nombre}</td>
            <td>{a.presente ? '✓' : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
