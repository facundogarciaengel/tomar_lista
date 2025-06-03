import styles from './AttendanceForm.module.css';

export default function AttendanceForm({ alumnos, onToggle }) {
  return (
    <div className={styles.root}>
      {alumnos.map((a) => (
        <label key={a.id} className={styles.item}>
          <input type="checkbox" checked={a.presente} onChange={() => onToggle(a.id)} /> {a.nombre}
        </label>
      ))}
    </div>
  );
}
