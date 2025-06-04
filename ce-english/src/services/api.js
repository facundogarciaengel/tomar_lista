// src/services/api.js
import axios from 'axios';

// Configura la baseURL incluyendo '/api'
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// ─── Auth ──────────────────────────────────────
/**
 * Login: POST /api/auth/login
 * @param {{ email: string, password: string }} credentials
 * @returns {{ token: string, user: object }}
 */
export const loginRequest = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

// ─── Clases ───────────────────────────────────
/**
 * Obtener todas las clases: GET /api/clases
 * @param {string} token JWT
 * @returns {Array<{ id: number, nombre: string, docente_id: number }>}
 */
export const fetchClases = async (token) => {
  const res = await api.get('/clases', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ─── Alumnos por clase ────────────────────────
/**
 * Obtener alumnos inscritos en una clase: GET /api/clases/:claseId/alumnos
 */
export const fetchAttendanceByClass = async (claseId, token) => {
  const res = await api.get(`/clases/${claseId}/alumnos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ─── Asistencias ──────────────────────────────
/**
 * Registrar asistencias en bulk: POST /api/asistencias
 * @param {Array<{ alumno_id: number, clase_id: number, fecha: string, presente: boolean }>} payload
 */
export const sendAttendance = async (payload, token) => {
  const res = await api.post('/asistencias', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Obtener un usuario por ID
 * GET /api/usuarios/:id
 */
export const fetchUsuario = async (id, token) => {
  const { data } = await api.get(`/usuarios/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;  // { id, nombre, email, rol, ... }
};

// ─── Reportes ───────────────────────────────────
/**
 * Resumen de asistencia por clase
 * GET /api/reportes/asistencia/clase/:claseId
 */
export const fetchReporteClase = async (claseId, token, params = {}) => {
  const { data } = await api.get(`/reportes/asistencia/clase/${claseId}`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return data;
};

// ─── Usuarios ───────────────────────────────────
/**
 * Registrar usuario (admin o docente)
 * POST /api/auth/register
 */
export const registerUser = async (payload, token) => {
  const { data } = await api.post('/auth/register', payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};

/** Obtener lista de usuarios */
export const fetchUsuarios = async (token) => {
  const { data } = await api.get('/usuarios', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ─── Alumnos ────────────────────────────────────
export const createAlumno = async (payload, token) => {
  const { data } = await api.post('/alumnos', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const fetchAlumnos = async (token) => {
  const { data } = await api.get('/alumnos', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ─── Clases ─────────────────────────────────────
export const createClase = async (payload, token) => {
  const { data } = await api.post('/clases', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const enrollAlumno = async (claseId, alumno_id, token) => {
  const { data } = await api.post(
    `/clases/${claseId}/alumnos`,
    { alumno_id },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
};


export default api;
