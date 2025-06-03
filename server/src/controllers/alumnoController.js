const Alumno = require("../models/Alumno");
const Clase = require("../models/Clase");
const AlumnoClase = require("../models/AlumnoClase");

// Obtener todos los alumnos
const obtenerAlumnos = async (req, res) => {
  try {
    const alumnos = await Alumno.findAll();
    res.json(alumnos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Obtener un alumno por ID
const obtenerAlumnoPorId = async (req, res) => {
  try {
    const alumno = await Alumno.findByPk(req.params.id);
    if (!alumno) {
      return res.status(404).json({ msg: "Alumno no encontrado" });
    }
    res.json(alumno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Crear un nuevo alumno
const crearAlumno = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    const nuevoAlumno = await Alumno.create({ nombre, email, telefono });
    res.status(201).json({ msg: "Alumno creado con éxito", nuevoAlumno });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Actualizar un alumno
const actualizarAlumno = async (req, res) => {
  try {
    const alumno = await Alumno.findByPk(req.params.id);
    if (!alumno) {
      return res.status(404).json({ msg: "Alumno no encontrado" });
    }

    const { nombre, email, telefono } = req.body;
    await alumno.update({ nombre, email, telefono });

    res.json({ msg: "Alumno actualizado correctamente", alumno });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Eliminar un alumno
const eliminarAlumno = async (req, res) => {
  try {
    const alumno = await Alumno.findByPk(req.params.id);
    if (!alumno) {
      return res.status(404).json({ msg: "Alumno no encontrado" });
    }

    await alumno.destroy();
    res.json({ msg: "Alumno eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Obtener todas las clases de un alumno
const obtenerClasesDeAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;

    // Verificar que el alumno exista
    const alumnoExiste = await Alumno.findByPk(alumnoId);
    if (!alumnoExiste) {
      return res.status(404).json({ msg: "Alumno no encontrado" });
    }

    // Buscar todas las inscripciones
    const inscripciones = await AlumnoClase.findAll({
      where: { alumno_id: alumnoId },
    });

    const claseIds = inscripciones.map((insc) => insc.clase_id);

    // Buscar las clases por los IDs
    const clases = await Clase.findAll({
      where: { id: claseIds },
    });

    res.json(clases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las clases del alumno" });
  }
}; 


module.exports = {
   obtenerAlumnos,
    obtenerAlumnoPorId,
     crearAlumno,
      actualizarAlumno,
       eliminarAlumno,
      obtenerClasesDeAlumno,
      };
