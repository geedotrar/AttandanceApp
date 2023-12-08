const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "kegiatan",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      absensi_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "absensi",
          key: "id",
        },
      },
      nama_kegiatan: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      tableName: "kegiatan",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "kegiatan_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
