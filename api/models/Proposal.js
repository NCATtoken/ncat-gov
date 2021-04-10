"use strict";
const { Model, DataTypes } = require("sequelize");
const { BigNumber } = require("ethers");

const PROPOSAL_STATES = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7;
const ZERO_BN = BigNumber.from(0);

module.exports = {
  PROPOSAL_STATES,
  model: (sequelize) => {
    class Proposal extends Model {}

    Proposal.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: "compositeIndex",
        },
        author: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: "users",
            key: "address",
          },
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        state: {
          type: DataTypes.ENUM({ values: Object.values(PROPOSAL_STATES) }),
          defaultValue: PROPOSAL_STATES.PENDING,
        },
        expiration: {
          type: DataTypes.DATE,
          defaultValue: new Date(new Date().getTime() + ONE_WEEK_MS),
        },
        voters: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          defaultValue: [],
        },
        for: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: ZERO_BN.toHexString(),
        },
        against: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: ZERO_BN.toHexString(),
        },
      },
      { sequelize, modelName: "proposals" }
    );

    return Proposal;
  },
};
