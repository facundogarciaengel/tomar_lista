const Usuario = require("../models/Usuario");

// Obtener todos los usuarios (solo admin)
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: ["id", "nombre", "email", "rol"] });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Obtener un usuario por ID (solo admin)
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: ["id", "nombre", "email", "rol"],
    });
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Actualizar un usuario por ID (solo admin)
const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const { nombre, email, rol } = req.body;
    await usuario.update({ nombre, email, rol });

    res.json({ msg: "Usuario actualizado correctamente", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Eliminar un usuario por ID (solo admin)
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    await usuario.destroy();
    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

module.exports = { obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario };
