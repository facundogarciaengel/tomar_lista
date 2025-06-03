const express = require("express");
const { check } = require("express-validator");
const { registrarUsuario, loginUsuario } = require("../controllers/authController");
const { verificarToken, esAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

/* ─── Registro (solo admin) ───────────────────── */
router.post(
  "/register",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Debe ser un email válido").isEmail(),
    check("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
    check("rol", "El rol debe ser 'admin' o 'docente'").isIn(["admin", "docente"]),
  ],
  registrarUsuario
);

/* ─── Login ───────────────────────────────────── */
router.post(
  "/login",
  [
    check("email", "Debe ser un email válido").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
  ],
  loginUsuario
);

/* ─── Rutas protegidas de ejemplo ─────────────── */
router.get("/perfil", verificarToken, (req, res) => {
  res.json({ msg: "Acceso concedido", usuario: req.usuario });
});

router.get("/admin", verificarToken, esAdmin, (_req, res) => {
  res.json({ msg: "Bienvenido Admin" });
});

module.exports = router;
