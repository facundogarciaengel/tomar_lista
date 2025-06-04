// 📁 /src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { loginRequest } from '../services/api';
import useAuth from '../hooks/useAuth';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      const data = await loginRequest(credentials); // { token, user }
      login(data);                                  // guarda token + user
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <LoginForm
        onSubmit={handleLogin}
        error={error}
        loading={loading}
      />
    </div>
  );
}
