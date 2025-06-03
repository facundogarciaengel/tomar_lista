const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "Acceso denegado. No hay token." });
  }

  try {
    // Si el token comienza con "Bearer ", lo limpiamos
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Agrega la info del usuario al request
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token no válido." });
  }
};

// Middleware para verificar si es Admin 
const esAdmin = (req, res, next) => {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ msg: "Acceso denegado. No eres administrador." });
  }
  next();
};

module.exports = { verificarToken, esAdmin };
