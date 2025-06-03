const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
require("dotenv").config();

/* ---------- Util: generar JWT ---------- */
const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

/* ---------- Registro de usuario ---------- */
const registrarUsuario = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

    const { nombre, email, password, rol } = req.body;   // <- password

    // ¿Existe ya?
    let usuario = await Usuario.findOne({ where: { email } });
    if (usuario) return res.status(400).json({ msg: "El usuario ya existe" });

    // Hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Crear
    usuario = await Usuario.create({
      nombre,
      email,
      contraseña: hash,          // columna sigue siendo "contraseña"
      rol,
    });

    const token = generarToken(usuario);
    res.status(201).json({ msg: "Usuario registrado con éxito", token, user: usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

/* ---------- Login ---------- */
const loginUsuario = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

    const { email, password } = req.body;              // <- password

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(400).json({ msg: "Credenciales inválidas" });

    const valido = await bcrypt.compare(password, usuario.contraseña);  // comparar con columna "contraseña"
    if (!valido) return res.status(400).json({ msg: "Credenciales inválidas" });

    const token = generarToken(usuario);
    res.json({ msg: "Inicio de sesión exitoso", token, user: usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

module.exports = { registrarUsuario, loginUsuario };
