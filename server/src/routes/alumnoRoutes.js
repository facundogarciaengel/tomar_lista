const express = require("express");
const { verificarToken } = require("../middlewares/authMiddleware");
const {
  obtenerAlumnos,
  obtenerAlumnoPorId,
  crearAlumno,
  actualizarAlumno,
  eliminarAlumno,
  obtenerClasesDeAlumno
} = require("../controllers/alumnoController");

const router = express.Router();

// Obtener todos los alumnos
router.get("/", verificarToken, obtenerAlumnos);

// Obtener un alumno por ID
router.get("/:id", verificarToken, obtenerAlumnoPorId);

// Crear un nuevo alumno
router.post("/", verificarToken, crearAlumno);

// Actualizar un alumno por ID
router.put("/:id", verificarToken, actualizarAlumno);

// Eliminar un alumno por ID
router.delete("/:id", verificarToken, eliminarAlumno);
router.get("/:alumnoId/clases", verificarToken, obtenerClasesDeAlumno);


module.exports = router;
