//config/db
import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
});

// db
//   .authenticate()
//   .then(() => console.log("connection has been estabilished successfully"))
//   .catch((err) => console.log(err));

export default db;
