import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import {
  registerUser,
  createAlumno,
  createClase,
  enrollAlumno,
  fetchClases,
  fetchAlumnos,
  fetchUsuarios,
} from '../services/api';
import Spinner from '../components/Spinner';
import styles from './Login.module.css';

export default function Admin() {
  const { user } = useAuth();
  const token = user?.token;

  // datos auxiliares
  const [docentes, setDocentes] = useState([]);
  const [clases, setClases] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const [u, c, a] = await Promise.all([
          fetchUsuarios(token),
          fetchClases(token),
          fetchAlumnos(token),
        ]);
        setDocentes(u.filter((us) => us.rol === 'docente'));
        setClases(c);
        setAlumnos(a);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [token]);

  // ------ Estados de formularios ------
  const [uNombre, setUNombre] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uPassword, setUPassword] = useState('');
  const [uRol, setURol] = useState('docente');
  const [uLoading, setULoading] = useState(false);

  const [aNombre, setANombre] = useState('');
  const [aEmail, setAEmail] = useState('');
  const [aTelefono, setATelefono] = useState('');
  const [aLoading, setALoading] = useState(false);

  const [cNombre, setCNombre] = useState('');
  const [cDocente, setCDocente] = useState('');
  const [cLoading, setCLoading] = useState(false);

  const [insClase, setInsClase] = useState('');
  const [insAlumno, setInsAlumno] = useState('');
  const [iLoading, setILoading] = useState(false);

  // ------ Handlers ------
  const handleUser = async (e) => {
    e.preventDefault();
    setULoading(true);
    try {
      await registerUser({ nombre: uNombre, email: uEmail, password: uPassword, rol: uRol }, token);
      alert('Usuario registrado');
      setUNombre('');
      setUEmail('');
      setUPassword('');
      setURol('docente');
    } catch (err) {
      console.error(err);
      alert('Error al registrar usuario');
    } finally {
      setULoading(false);
    }
  };

  const handleAlumno = async (e) => {
    e.preventDefault();
    setALoading(true);
    try {
      await createAlumno({ nombre: aNombre, email: aEmail, telefono: aTelefono }, token);
      alert('Alumno creado');
      setANombre('');
      setAEmail('');
      setATelefono('');
      const lista = await fetchAlumnos(token);
      setAlumnos(lista);
    } catch (err) {
      console.error(err);
      alert('Error al crear alumno');
    } finally {
      setALoading(false);
    }
  };

  const handleClase = async (e) => {
    e.preventDefault();
    setCLoading(true);
    try {
      await createClase({ nombre: cNombre, docente_id: Number(cDocente) }, token);
      alert('Clase creada');
      setCNombre('');
      setCDocente('');
      const lista = await fetchClases(token);
      setClases(lista);
    } catch (err) {
      console.error(err);
      alert('Error al crear clase');
    } finally {
      setCLoading(false);
    }
  };

  const handleInscribir = async (e) => {
    e.preventDefault();
    setILoading(true);
    try {
      await enrollAlumno(insClase, insAlumno, token);
      alert('Alumno inscrito');
    } catch (err) {
      console.error(err);
      alert('Error al inscribir');
    } finally {
      setILoading(false);
    }
  };

  if (loadingData) return <Spinner />;

  return (
    <section style={{ padding: '1rem' }}>
      <h2>Administrar</h2>

      <form className={styles.root} onSubmit={handleUser} style={{ marginBottom: '2rem' }}>
        <h3 className={styles.title}>Registrar usuario</h3>
        <div className={styles.field}>
          <label className={styles.label}>Nombre</label>
          <input className={styles.input} value={uNombre} onChange={e => setUNombre(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} type="email" value={uEmail} onChange={e => setUEmail(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Contraseña</label>
          <input className={styles.input} type="password" value={uPassword} onChange={e => setUPassword(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Rol</label>
          <select className={styles.input} value={uRol} onChange={e => setURol(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="docente">Docente</option>
          </select>
        </div>
        <button className={styles.button} disabled={uLoading}>{uLoading ? '...' : 'Crear usuario'}</button>
      </form>

      <form className={styles.root} onSubmit={handleAlumno} style={{ marginBottom: '2rem' }}>
        <h3 className={styles.title}>Crear alumno</h3>
        <div className={styles.field}>
          <label className={styles.label}>Nombre</label>
          <input className={styles.input} value={aNombre} onChange={e => setANombre(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} type="email" value={aEmail} onChange={e => setAEmail(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Teléfono</label>
          <input className={styles.input} value={aTelefono} onChange={e => setATelefono(e.target.value)} />
        </div>
        <button className={styles.button} disabled={aLoading}>{aLoading ? '...' : 'Crear alumno'}</button>
      </form>

      <form className={styles.root} onSubmit={handleClase} style={{ marginBottom: '2rem' }}>
        <h3 className={styles.title}>Crear clase</h3>
        <div className={styles.field}>
          <label className={styles.label}>Nombre</label>
          <input className={styles.input} value={cNombre} onChange={e => setCNombre(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Docente</label>
          <select className={styles.input} value={cDocente} onChange={e => setCDocente(e.target.value)} required>
            <option value="">Selecciona un docente</option>
            {docentes.map(d => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </div>
        <button className={styles.button} disabled={cLoading}>{cLoading ? '...' : 'Crear clase'}</button>
      </form>

      <form className={styles.root} onSubmit={handleInscribir}>
        <h3 className={styles.title}>Inscribir alumno</h3>
        <div className={styles.field}>
          <label className={styles.label}>Clase</label>
          <select className={styles.input} value={insClase} onChange={e => setInsClase(e.target.value)} required>
            <option value="">Selecciona una clase</option>
            {clases.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Alumno</label>
          <select className={styles.input} value={insAlumno} onChange={e => setInsAlumno(e.target.value)} required>
            <option value="">Selecciona un alumno</option>
            {alumnos.map(a => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </div>
        <button className={styles.button} disabled={iLoading}>{iLoading ? '...' : 'Inscribir'}</button>
      </form>
    </section>
  );
}
