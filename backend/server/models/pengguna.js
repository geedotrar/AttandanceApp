const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "pengguna",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      // uuid: {
      //   type: DataTypes.STRING,
      //   defaultValue: DataTypes.UUIDV4,
      //   allowNull: false,
      //   validate: {
      //     notEmpty: true,
      //   },
      // },
      username: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: "pengguna_username_key",
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      nama: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      jabatan: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "pengguna",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "pengguna_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
        {
          name: "pengguna_username_key",
          unique: true,
          fields: [{ name: "username" }],
        },
      ],
    }
  );
};
