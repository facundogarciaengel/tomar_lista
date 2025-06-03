// import { useEffect, useState } from 'react';
// import useAuth from '../hooks/useAuth';
// import { fetchAttendanceByClass, sendAttendance, fetchClases } from '../services/api';
// import AttendanceForm from '../components/AttendanceForm';
// import Spinner from '../components/Spinner';
// export default function Asistencia() {
//   const { user } = useAuth();
//   const [clases, setClases] = useState([]);
//   const [selectedClass, setSelectedClass] = useState('');
//   const [alumnos, setAlumnos] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(()=> { fetchClases(user.token).then(setClases); }, [user]);
//   const loadAlumnos = async (id) => { setLoading(true); const data = await fetchAttendanceByClass(id, user.token); setAlumnos(data); setLoading(false); };
//   const togglePresente = (id) => setAlumnos(prev=>prev.map(a=> a.id===id? {...a, presente:!a.presente}:a));
//   const handleSubmit = async () => { await sendAttendance(selectedClass, alumnos, user.token); alert('Asistencia enviada'); };

//   return (
//     <section style={{padding:'1rem'}}>
//       <h2>Asistencia</h2>
//       <select value={selectedClass} onChange={e=>{ const id=e.target.value; setSelectedClass(id); if(id) loadAlumnos(id); }}>
//         <option value="">Selecciona una clase</option>
//         {clases.map(c=> <option key={c.id} value={c.id}>{c.nombre}</option>)}
//       </select>
//       {loading && <Spinner />}
//       {alumnos.length > 0 && (
//         <>
//           <AttendanceForm alumnos={alumnos} onToggle={togglePresente} />
//           <button style={{marginTop:'1rem'}} onClick={handleSubmit}>Enviar asistencia</button>
//         </>
//       )}
//     </section>
//   );
// }
// src/pages/Asistencia.jsx
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import ClassSelect from '../components/ClassSelect';
import AttendanceForm from '../components/AttendanceForm';
import Spinner from '../components/Spinner';
import { fetchAttendanceByClass, sendAttendance } from '../services/api';

export default function Asistencia() {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1) Cuando cambie la clase seleccionada, cargamos sus alumnos
  useEffect(() => {
    if (!selectedClass) {
      setAlumnos([]);
      return;
    }
    setLoading(true);
    fetchAttendanceByClass(selectedClass, user.token)
      .then(data =>
        setAlumnos(
          data.map((a) => ({ ...a, presente: false }))
        )
      )
      .catch((err) => {
        console.error('Error cargando alumnos:', err);
      })
      .finally(() => setLoading(false));
  }, [selectedClass, user.token]);

  // 2) Toggle de presencia
  const togglePresente = (id) =>
    setAlumnos((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, presente: !a.presente } : a
      )
    );

  // 3) Enviar asistencias
  const handleSave = async () => {
    setSaving(true);
    const fecha = new Date().toISOString().slice(0, 10);
    const payload = alumnos.map((a) => ({
      alumno_id: a.id,
      clase_id: Number(selectedClass),
      fecha,
      presente: a.presente,
    }));
    try {
      await sendAttendance(payload, user.token);
      alert('Asistencia guardada ✔️');
      setAlumnos([]);      // limpia el formulario
      setSelectedClass(''); // vuelve a la selección
    } catch (err) {
      console.error(err);
      alert('Error al guardar asistencia ❌');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Asistencia</h2>

      {/* Selector de clases */}
      <ClassSelect token={user.token} onSelect={setSelectedClass} />

      {/* Loader al traer alumnos */}
      {loading && <Spinner />}

      {/* Mensaje si no hay alumnos tras cargar */}
      {!loading && selectedClass && alumnos.length === 0 && (
        <p>No hay alumnos inscriptos en esta clase.</p>
      )}

      {/* Formulario de asistencia */}
      {alumnos.length > 0 && (
        <>
          <AttendanceForm alumnos={alumnos} onToggle={togglePresente} />

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--primary-500)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? <Spinner /> : 'Guardar asistencia'}
          </button>
        </>
      )}
    </section>
  );
}
