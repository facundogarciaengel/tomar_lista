const sequelize = require("../config");
const Usuario = require("./Usuario");
const Alumno = require("./Alumno");
const Clase = require("./Clase");
const Asistencia = require("./Asistencia");
const AlumnoClase = require("./AlumnoClase");

// Relaciones
Usuario.hasMany(Clase, { foreignKey: "docente_id" });
Clase.belongsTo(Usuario, { foreignKey: "docente_id" });

Alumno.belongsToMany(Clase, { through: AlumnoClase, foreignKey: "alumno_id" });
Clase.belongsToMany(Alumno, { through: AlumnoClase, foreignKey: "clase_id" });

Alumno.hasMany(Asistencia, { foreignKey: "alumno_id" });
Asistencia.belongsTo(Alumno, { foreignKey: "alumno_id" });

Clase.hasMany(Asistencia, { foreignKey: "clase_id" });
Asistencia.belongsTo(Clase, { foreignKey: "clase_id" });

module.exports = {
  sequelize,
  Usuario,
  Alumno,
  Clase,
  Asistencia,
  AlumnoClase,
};
