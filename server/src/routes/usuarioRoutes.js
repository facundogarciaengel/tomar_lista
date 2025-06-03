const express = require("express");
const { verificarToken, esAdmin } = require("../middlewares/authMiddleware");
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/usuarioController");

const router = express.Router();

// Obtener todos los usuarios (solo admin)
router.get("/", verificarToken, esAdmin, obtenerUsuarios);

// Obtener un usuario por ID (solo admin)
router.get("/:id", verificarToken, esAdmin, obtenerUsuarioPorId);

// Actualizar un usuario por ID (solo admin)
router.put("/:id", verificarToken, esAdmin, actualizarUsuario);

// Eliminar un usuario por ID (solo admin)
router.delete("/:id", verificarToken, esAdmin, eliminarUsuario);

module.exports = router;
