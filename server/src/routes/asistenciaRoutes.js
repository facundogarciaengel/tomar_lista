const express = require("express");
const { verificarToken } = require("../middlewares/authMiddleware");
const {
  registrarAsistencia,
  obtenerAsistencias,
  obtenerAsistenciasPorClase,
  obtenerAsistenciasPorAlumno,
} = require("../controllers/asistenciaController");

const router = express.Router();

// Registrar nueva asistencia
router.post("/", verificarToken, registrarAsistencia);

// Obtener todas las asistencias
router.get("/", verificarToken, obtenerAsistencias);

router.get("/clase/:claseId", verificarToken, obtenerAsistenciasPorClase);

router.get("/alumno/:alumnoId", verificarToken, obtenerAsistenciasPorAlumno);



module.exports = router;
