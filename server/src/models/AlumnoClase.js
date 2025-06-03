const { DataTypes } = require("sequelize");
const sequelize = require("../config");
const Alumno = require("./Alumno");
const Clase = require("./Clase");

const AlumnoClase = sequelize.define("AlumnoClase", {
  alumno_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Alumno,
      key: "id",
    },
    primaryKey: true,
  },
  clase_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Clase,
      key: "id",
    },
    primaryKey: true,
  },
});

module.exports = AlumnoClase;
