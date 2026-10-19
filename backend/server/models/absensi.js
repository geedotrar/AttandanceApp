const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "absensi",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      tanggal_absen: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      jam_check_in: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      jam_check_out: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "pengguna",
          key: "id",
        },
      },
      foto_checkin: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      foto_checkout: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "absensi",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "absensi_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
