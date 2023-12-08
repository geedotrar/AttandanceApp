//init models
import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const DataTypes = require("sequelize").DataTypes;
const _absensi = require("./absensi");
const _kegiatan = require("./kegiatan");
const _pengguna = require("./pengguna");

function initModels(sequelize) {
  const absensi = _absensi(sequelize, DataTypes);
  const kegiatan = _kegiatan(sequelize, DataTypes);
  const pengguna = _pengguna(sequelize, DataTypes);

  kegiatan.belongsTo(absensi, { as: "absensi", foreignKey: "absensi_id", onDelete: "CASCADE" });
  absensi.hasMany(kegiatan, { as: "kegiatan", foreignKey: "absensi_id", onDelete: "CASCADE" });
  absensi.belongsTo(pengguna, { as: "user", foreignKey: "user_id", onDelete: "CASCADE" });
  pengguna.hasMany(absensi, { as: "absensis", foreignKey: "user_id", onDelete: "CASCADE" });

  return {
    absensi,
    kegiatan,
    pengguna,
  };
}

const models = initModels(sequelize);
export default models;
export { sequelize };
// module.exports = initModels;
// module.exports.initModels = initModels;
// module.exports.default = initModels;
