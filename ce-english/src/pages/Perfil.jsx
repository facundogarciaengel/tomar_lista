import useAuth from '../hooks/useAuth';
export default function Perfil() {
  const { user, logout } = useAuth();
  return (
    <section style={{padding:'1rem'}}>
      <h2>Mi Perfil</h2>
      {user ? (
        <ul>
          <li>Nombre: {user.nombre}</li>
          <li>Email: {user.email}</li>
        </ul>
      ) : <p>No disponible</p>}
      <button onClick={logout} style={{marginTop:'1rem'}}>Cerrar sesión</button>
    </section>
  );
}
