import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  /* Siempre llamar al hook antes del return */
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        !e.target.closest(`.${styles.menu}`) &&
        !e.target.closest(`.${styles.burger}`)
      ) setOpen(false);
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  const isLogin = pathname === '/';

  /* ---------- JSX ---------- */
  return (
    <header className={styles.root}>
      <div className={styles.container}>
        <Link to={isLogin ? '/' : '/dashboard'} className={styles.logo}>
          C&E English
        </Link>

        {/* Muestra el resto solo si no es la página de login */}
        {!isLogin && (
          <>
            <button
              className={styles.burger}
              onClick={() => setOpen(!open)}
              aria-label="Abrir menú"
            >
              <span className={open ? styles.line1open : ''} />
              <span className={open ? styles.line2open : ''} />
              <span className={open ? styles.line3open : ''} />
            </button>

            <nav className={`${styles.menu} ${open ? styles.menuOpen : ''}`}>
              <NavLink to="/dashboard"  onClick={() => setOpen(false)}>Dashboard</NavLink>
              <NavLink to="/clases"     onClick={() => setOpen(false)}>Clases</NavLink>
              <NavLink to="/asistencia" onClick={() => setOpen(false)}>Asistencia</NavLink>
              <NavLink to="/reportes"  onClick={() => setOpen(false)}>Reportes</NavLink>
              <NavLink to="/admin"     onClick={() => setOpen(false)}>Admin</NavLink>
              <NavLink to="/perfil"     onClick={() => setOpen(false)}>Perfil</NavLink>
              <button className={styles.logout} onClick={logout}>Salir</button>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
