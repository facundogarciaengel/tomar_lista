const { Sequelize } = require("sequelize");
require("dotenv").config();

// Configuración de la conexión a MySQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false, // Deshabilita logs de consultas SQL
});

module.exports = sequelize;
