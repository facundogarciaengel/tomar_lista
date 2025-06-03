// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  );
}
