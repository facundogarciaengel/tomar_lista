const { DataTypes } = require("sequelize");
const sequelize = require("../config");
const Alumno = require("./Alumno");
const Clase = require("./Clase");

const Asistencia = sequelize.define("Asistencia", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  alumno_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Alumno,
      key: "id",
    },
  },
  clase_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Clase,
      key: "id",
    },
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  presente: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Asistencia;
