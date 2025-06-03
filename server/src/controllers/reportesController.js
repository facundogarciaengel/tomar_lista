const { Op } = require("sequelize");
const { fn, col } = require("sequelize");
const { Sequelize } = require("sequelize");
const Asistencia = require("../models/Asistencia");
const Clase = require("../models/Clase");
const AlumnoClase = require("../models/AlumnoClase");
const Alumno = require("../models/Alumno");

const reporteAsistenciaPorAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;
    const { desde, hasta } = req.query;

    const where = { alumno_id: alumnoId };

    if (desde && hasta) {
      where.fecha = { [Op.between]: [desde, hasta] };
    } else if (desde) {
      where.fecha = { [Op.gte]: desde };
    } else if (hasta) {
      where.fecha = { [Op.lte]: hasta };
    }

    const asistencias = await Asistencia.findAll({ where });

    const total = asistencias.length;
    const presentes = asistencias.filter(a => a.presente).length;
    const ausentes = total - presentes;
    const porcentaje = total > 0 ? ((presentes / total) * 100).toFixed(2) : "0.00";

    res.json({
      alumno_id: parseInt(alumnoId),
      total,
      presentes,
      ausentes,
      porcentaje_asistencia: `${porcentaje}%`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al generar el reporte del alumno" });
  }
};

const reporteAsistenciaPorClase = async (req, res) => {
  try {
    const { claseId } = req.params;
    const { desde, hasta } = req.query;

    const where = { clase_id: claseId };

    if (desde && hasta) {
      where.fecha = { [Op.between]: [desde, hasta] };
    } else if (desde) {
      where.fecha = { [Op.gte]: desde };
    } else if (hasta) {
      where.fecha = { [Op.lte]: hasta };
    }

    const asistencias = await Asistencia.findAll({ where });
    const clase = await Clase.findByPk(claseId);

    if (!clase) {
      return res.status(404).json({ msg: "Clase no encontrada" });
    }

    const total = asistencias.length;
    const presentes = asistencias.filter(a => a.presente).length;
    const ausentes = total - presentes;
    const porcentaje = total > 0 ? ((presentes / total) * 100).toFixed(2) : "0.00";

    res.json({
      clase_id: clase.id,
      nombre_clase: clase.nombre,
      total_registros: total,
      presentes,
      ausentes,
      porcentaje_asistencia_promedio: `${porcentaje}%`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al generar el reporte de la clase" });
  }
};


const reporteAsistenciaPorFechaYClase = async (req, res) => {
    try {
      const { claseId } = req.params;
      const { fecha } = req.query;
  
      if (!fecha) {
        return res.status(400).json({ msg: "La fecha es requerida en el query (?fecha=YYYY-MM-DD)" });
      }
  
      // Obtener alumnos de esa clase
      const relaciones = await AlumnoClase.findAll({
        where: { clase_id: claseId },
      });
  
      const alumnoIds = relaciones.map((rel) => rel.alumno_id);
  
      if (alumnoIds.length === 0) {
        return res.status(200).json({
          clase_id: parseInt(claseId),
          fecha,
          presentes: [],
          ausentes: [],
        });
      }
  
      const asistencias = await Asistencia.findAll({
        where: {
          clase_id: claseId,
          fecha,
        },
      });
  
      const presentesIds = asistencias
        .filter((a) => a.presente)
        .map((a) => a.alumno_id);
  
      const ausentesIds = asistencias
        .filter((a) => !a.presente)
        .map((a) => a.alumno_id);
  
      const presentes = await Alumno.findAll({
        where: { id: presentesIds },
        attributes: ["id", "nombre"],
      });
  
      const ausentes = await Alumno.findAll({
        where: { id: ausentesIds },
        attributes: ["id", "nombre"],
      });
  
      res.json({
        clase_id: parseInt(claseId),
        fecha,
        presentes: presentes.map((a) => ({ alumno_id: a.id, nombre: a.nombre })),
        ausentes: ausentes.map((a) => ({ alumno_id: a.id, nombre: a.nombre })),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al generar el reporte por fecha y clase" });
    }
  };
  
  const reporteAusenciasPorFecha = async (req, res) => {
    try {
      const { fecha } = req.query;
  
      if (!fecha) {
        return res.status(400).json({ msg: "La fecha es requerida (?fecha=YYYY-MM-DD)" });
      }
  
      // Traer todas las asistencias de esa fecha donde presente = false
      const asistenciasAusentes = await Asistencia.findAll({
        where: {
          fecha,
          presente: false,
        },
      });
  
      // Si no hay ausencias, devolver vacío
      if (asistenciasAusentes.length === 0) {
        return res.json({ fecha, ausentes: [] });
      }
  
      // Traer info del alumno y la clase asociada
      const resultados = await Promise.all(
        asistenciasAusentes.map(async (a) => {
          const alumno = await Alumno.findByPk(a.alumno_id, { attributes: ["id", "nombre"] });
          const clase = await Clase.findByPk(a.clase_id, { attributes: ["nombre"] });
  
          return {
            alumno_id: alumno.id,
            nombre: alumno.nombre,
            clase: clase.nombre,
          };
        })
      );
  
      res.json({ fecha, ausentes: resultados });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al generar el reporte de ausencias por fecha" });
    }
  };
  

const rankingAlumnosMasAusencias = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const whereClause = {
      presente: false
    };

    if (desde && hasta) {
      whereClause.fecha = {
        [Op.between]: [desde, hasta]
      };
    } else if (desde) {
      whereClause.fecha = {
        [Op.gte]: desde
      };
    } else if (hasta) {
      whereClause.fecha = {
        [Op.lte]: hasta
      };
    }

    const ausencias = await Asistencia.findAll({
      where: whereClause,
      attributes: [
        "alumno_id",
        [fn("COUNT", col("alumno_id")), "total_ausencias"]
      ],
      group: ["alumno_id"],
      order: [[fn("COUNT", col("alumno_id")), "DESC"]],
    });

    const resultados = await Promise.all(
      ausencias.map(async (a) => {
        const alumno = await Alumno.findByPk(a.alumno_id, {
          attributes: ["nombre"],
        });

        return {
          alumno_id: a.alumno_id,
          nombre: alumno ? alumno.nombre : "Alumno no encontrado",
          total_ausencias: parseInt(a.get("total_ausencias")),
        };
      })
    );

    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al generar el ranking de ausencias" });
  }
};


const reporteComparativaMensualPorClase = async (req, res) => {
  try {
    const { claseId } = req.params;

    const resultados = await Asistencia.findAll({
      where: {
        clase_id: claseId
      },
      attributes: [
        [Sequelize.fn("DATE_FORMAT", Sequelize.col("fecha"), "%Y-%m"), "mes"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
        [Sequelize.fn("SUM", Sequelize.literal("CASE WHEN presente = true THEN 1 ELSE 0 END")), "presentes"],
        [Sequelize.fn("SUM", Sequelize.literal("CASE WHEN presente = false THEN 1 ELSE 0 END")), "ausentes"]
      ],
      group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("fecha"), "%Y-%m")],
      order: [[Sequelize.fn("DATE_FORMAT", Sequelize.col("fecha"), "%Y-%m"), "ASC"]]
    });

    const formateado = resultados.map((r) => {
      const total = parseInt(r.get("total"));
      const presentes = parseInt(r.get("presentes"));
      const ausentes = parseInt(r.get("ausentes"));

      return {
        mes: r.get("mes"),
        total,
        presentes,
        ausentes,
        porcentaje_asistencia: `${((presentes / total) * 100).toFixed(2)}%`
      };
    });

    res.json(formateado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al generar la comparativa mensual por clase" });
  }
};



module.exports = { reporteAsistenciaPorAlumno,
     reporteAsistenciaPorClase,
      reporteAsistenciaPorFechaYClase,
       reporteAusenciasPorFecha,
         rankingAlumnosMasAusencias,
            reporteComparativaMensualPorClase
     };