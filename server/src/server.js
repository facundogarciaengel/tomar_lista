const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

// Rutas
const authRoutes       = require('./routes/authRoutes');
const usuarioRoutes    = require('./routes/usuarioRoutes');
const alumnoRoutes     = require('./routes/alumnoRoutes');
const claseRoutes      = require('./routes/claseRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');
const reportesRoutes   = require('./routes/reportesRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ---------- Middlewares ---------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173', process.env.FRONTEND_URL || ''],
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));

/* ---------- Rutas ---------- */
app.use('/api/auth',        authRoutes);
app.use('/api/usuarios',    usuarioRoutes);
app.use('/api/alumnos',     alumnoRoutes);
app.use('/api/clases',      claseRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/reportes',    reportesRoutes);

/* ---------- 404 & error handler ---------- */
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Error interno' });
});

/* ---------- DB ---------- */
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a MySQL exitosa'))
  .catch((e) => console.error('❌ Error al conectar con MySQL:', e));

sequelize.sync({ force: false })
  .then(() => console.log('✅ Base de datos sincronizada'))
  .catch((e) => console.error('❌ Error al sincronizar la base de datos:', e));

/* ---------- Lista de rutas ---------- */
console.log('✅ Rutas registradas:');
app._router.stack
  .filter(r => r.route)
  .forEach(r => {
    const methods = Object.keys(r.route.methods).map(m => m.toUpperCase()).join(',');
    console.log(`➡️ ${methods} ${r.route.path}`);
  });

/* ---------- Server ---------- */
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
