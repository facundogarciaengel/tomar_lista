const { DataTypes } = require("sequelize");
const sequelize = require("../config"); // Asegurate de que apunta al archivo correcto

const Alumno = sequelize.define("Alumno", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Alumno;
