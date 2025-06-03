const Asistencia = require("../models/Asistencia");
const Alumno = require("../models/Alumno");
const Clase = require("../models/Clase");

// Registrar asistencia
const registrarAsistencia = async (req, res) => {
  try {
    const { alumno_id, clase_id, fecha, presente } = req.body;

    // Validar que el alumno y la clase existan
    const alumno = await Alumno.findByPk(alumno_id);
    const clase = await Clase.findByPk(clase_id);

    if (!alumno || !clase) {
      return res.status(404).json({ msg: "Alumno o clase no encontrados" });
    }

    // Verificar si ya existe una asistencia para ese alumno, clase y fecha
    const yaExiste = await Asistencia.findOne({
      where: {
        alumno_id,
        clase_id,
        fecha,
      },
    });

    if (yaExiste) {
      return res.status(400).json({ msg: "Ya existe una asistencia registrada para este alumno en esta clase y fecha." });
    }

    // Crear asistencia
    const nuevaAsistencia = await Asistencia.create({
      alumno_id,
      clase_id,
      fecha,
      presente,
    });

    res.status(201).json({
      msg: "Asistencia registrada correctamente",
      nuevaAsistencia,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar la asistencia" });
  }
};

// Obtener todas las asistencias
const obtenerAsistencias = async (req, res) => {
  try {
    const asistencias = await Asistencia.findAll();
    res.json(asistencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener asistencias" });
  }
};

const { Op } = require("sequelize");

const obtenerAsistenciasPorClase = async (req, res) => {
  try {
    const { claseId } = req.params;
    const { fecha, desde, hasta, presente } = req.query;

    const where = {
      clase_id: claseId,
    };

    // Filtro por fecha exacta
    if (fecha) {
      where.fecha = fecha;
    }

    // Filtro por rango de fechas
    if (desde && hasta) {
      where.fecha = { [Op.between]: [desde, hasta] };
    } else if (desde) {
      where.fecha = { [Op.gte]: desde };
    } else if (hasta) {
      where.fecha = { [Op.lte]: hasta };
    }

    // Filtro por presencia (true/false)
    if (presente !== undefined) {
      if (presente === "true") where.presente = true;
      else if (presente === "false") where.presente = false;
    }

    const asistencias = await Asistencia.findAll({ where });
    res.json(asistencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener asistencias de la clase" });
  }
};

const obtenerAsistenciasPorAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;
    const { fecha, desde, hasta, presente } = req.query;

    const where = {
      alumno_id: alumnoId,
    };

    // Filtro por fecha exacta
    if (fecha) {
      where.fecha = fecha;
    }

    // Filtro por rango de fechas
    if (desde && hasta) {
      where.fecha = { [Op.between]: [desde, hasta] };
    } else if (desde) {
      where.fecha = { [Op.gte]: desde };
    } else if (hasta) {
      where.fecha = { [Op.lte]: hasta };
    }

    // Filtro por presencia (true o false como string)
    if (presente !== undefined) {
      if (presente === "true") where.presente = true;
      else if (presente === "false") where.presente = false;
    }

    const asistencias = await Asistencia.findAll({ where });
    res.json(asistencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener asistencias del alumno" });
  }
};


module.exports = {
  registrarAsistencia,
  obtenerAsistencias,
  obtenerAsistenciasPorClase,
  obtenerAsistenciasPorAlumno,
};
