import { useState } from 'react';
import styles from './LoginForm.module.css';
import Spinner from './Spinner';

export default function LoginForm({ onSubmit, error, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Iniciar sesión</h2>

      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="tu@ejemplo.com"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Contraseña</label>
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="submit"
        className={styles.button}
        disabled={loading}
      >
        {loading ? <Spinner /> : 'Ingresar'}
      </button>
    </form>
  );
}
