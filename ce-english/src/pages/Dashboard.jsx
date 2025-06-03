import useAuth from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <section style={{ padding: '1rem' }}>
      <h1>Bienvenido, {user?.nombre || 'Usuario'}!</h1>
      <p>Selecciona una opción en el menú.</p>
    </section>
  );
}
