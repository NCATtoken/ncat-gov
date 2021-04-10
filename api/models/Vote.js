"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = {
  model: (sequelize) => {
    class Vote extends Model {}
    Vote.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        voterAddress: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: "compositeIndex",
          references: {
            model: "users",
            key: "address",
          },
        },
        proposalId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: "compositeIndex",
          references: {
            model: "proposals",
            key: "id",
          },
        },
        weight: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        support: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      { sequelize, modelName: "votes" }
    );
    return Vote;
  },
};
