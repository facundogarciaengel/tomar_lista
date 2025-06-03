const { Router } = require("express");
const { verificarToken } = require("../middlewares/authMiddleware");
const { reporteAsistenciaPorAlumno,
     reporteAsistenciaPorClase,
        reporteAsistenciaPorFechaYClase,
        reporteAusenciasPorFecha,
        rankingAlumnosMasAusencias,
        reporteComparativaMensualPorClase
     } = require("../controllers/reportesController");

const router = Router();


router.get("/asistencia/alumno/:alumnoId", verificarToken, reporteAsistenciaPorAlumno);

router.get("/asistencia/clase/:claseId", verificarToken, reporteAsistenciaPorClase);

router.get("/asistencia/fecha/clase/:claseId", verificarToken, reporteAsistenciaPorFechaYClase);

router.get("/ausencias/fecha", verificarToken, reporteAusenciasPorFecha);

router.get("/ausencias/ranking", verificarToken, rankingAlumnosMasAusencias);

router.get("/asistencia/mensual/clase/:claseId", verificarToken, reporteComparativaMensualPorClase);


module.exports = router;
