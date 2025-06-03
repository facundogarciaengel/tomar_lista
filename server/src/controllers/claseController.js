const Alumno = require("../models/Alumno");
const Clase = require("../models/Clase");
const AlumnoClase = require("../models/AlumnoClase");

// Crear una nueva clase
const crearClase = async (req, res) => {
  try {
    const { nombre, docente_id } = req.body;

    const nuevaClase = await Clase.create({ nombre, docente_id });

    res.status(201).json({ msg: "Clase creada con éxito", nuevaClase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear la clase" });
  }
};

// Obtener todas las clases
const obtenerClases = async (req, res) => {
  try {
    const clases = await Clase.findAll();
    res.json(clases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las clases" });
  }
};

// Obtener clase por ID
const obtenerClasePorId = async (req, res) => {
  try {
    const clase = await Clase.findByPk(req.params.id);

    if (!clase) {
      return res.status(404).json({ msg: "Clase no encontrada" });
    }

    res.json(clase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al buscar la clase" });
  }
};

// Actualizar clase
const actualizarClase = async (req, res) => {
  try {
    const clase = await Clase.findByPk(req.params.id);

    if (!clase) {
      return res.status(404).json({ msg: "Clase no encontrada" });
    }

    const { nombre, docente_id } = req.body;

    await clase.update({ nombre, docente_id });

    res.json({ msg: "Clase actualizada correctamente", clase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar la clase" });
  }
};

// Eliminar clase
const eliminarClase = async (req, res) => {
  try {
    const clase = await Clase.findByPk(req.params.id);

    if (!clase) {
      return res.status(404).json({ msg: "Clase no encontrada" });
    }

    await clase.destroy();

    res.json({ msg: "Clase eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar la clase" });
  }
};

// Inscribir un alumno a una clase
const inscribirAlumno = async (req, res) => {
    try {
      const { claseId } = req.params;
      const { alumno_id } = req.body;
  
      // Verificar que exista el alumno
      const alumno = await Alumno.findByPk(alumno_id);
      if (!alumno) {
        return res.status(404).json({ msg: "Alumno no encontrado" });
      }
  
      // Verificar que exista la clase
      const clase = await Clase.findByPk(claseId);
      if (!clase) {
        return res.status(404).json({ msg: "Clase no encontrada" });
      }
  
      // Crear la inscripción
      await AlumnoClase.create({ alumno_id, clase_id: claseId });
  
      res.status(201).json({ msg: "Alumno inscrito correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al inscribir al alumno" });
    }
};
    // Obtener todos los alumnos de una clase
const obtenerAlumnosDeClase = async (req, res) => {
    try {
      const { claseId } = req.params;
  
      // Verificar que la clase exista
      const claseExiste = await Clase.findByPk(claseId);
      if (!claseExiste) {
        return res.status(404).json({ msg: "Clase no encontrada" });
      }
  
      // Buscar todos los alumno_id asociados a la clase
      const inscripciones = await AlumnoClase.findAll({
        where: { clase_id: claseId },
      });
  
      const alumnoIds = inscripciones.map((insc) => insc.alumno_id);
  
      // Traer los alumnos completos
      const alumnos = await Alumno.findAll({
        where: { id: alumnoIds },
      });
  
      res.json(alumnos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al obtener los alumnos de la clase" });
    }
  };

  // Desinscribir alumno de una clase
const desinscribirAlumno = async (req, res) => {
  try {
    const { claseId, alumnoId } = req.params;

    // Verificar si la inscripción existe
    const inscripcion = await AlumnoClase.findOne({
      where: {
        clase_id: claseId,
        alumno_id: alumnoId,
      },
    });

    if (!inscripcion) {
      return res.status(404).json({ msg: "La inscripción no existe" });
    }

    // Eliminar la inscripción
    await inscripcion.destroy();

    res.json({ msg: "Alumno desinscrito correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al desinscribir al alumno" });
  }
};
 

module.exports = {
  crearClase,
  obtenerClases,
  obtenerClasePorId,
  actualizarClase,
  eliminarClase,
inscribirAlumno,
obtenerAlumnosDeClase,
desinscribirAlumno,
};

