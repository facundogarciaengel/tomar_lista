const express = require("express");
const { verificarToken } = require("../middlewares/authMiddleware");
const {
  crearClase,
  obtenerClases,
  obtenerClasePorId,
  actualizarClase,
  eliminarClase,
    inscribirAlumno,
    obtenerAlumnosDeClase,
    desinscribirAlumno,
} = require("../controllers/claseController");

const router = express.Router();

// Obtener todas las clases
router.get("/", verificarToken, obtenerClases);

// Obtener una clase por ID
router.get("/:id", verificarToken, obtenerClasePorId);

// Crear una nueva clase
router.post("/", verificarToken, crearClase);

// Actualizar una clase
router.put("/:id", verificarToken, actualizarClase);

// Eliminar una clase
router.delete("/:id", verificarToken, eliminarClase);

router.post("/:claseId/alumnos", verificarToken, inscribirAlumno);

router.get("/:claseId/alumnos", verificarToken, obtenerAlumnosDeClase);

router.delete("/:claseId/alumnos/:alumnoId", verificarToken, desinscribirAlumno);




module.exports = router;
