const { DataTypes } = require("sequelize");
const sequelize = require("../config");
const Usuario = require("./Usuario");

const Clase = sequelize.define("Clase", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  docente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: "id",
    },
  },
});

module.exports = Clase;
