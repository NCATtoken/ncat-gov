"use strict";

const config = require("config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.get("db.name"),
  config.get("db.user"),
  config.get("db.password"),
  {
    host: config.get("db.host"),
    dialect: config.get("db.dialect"),
    logging: config.get("db.logs"),
    operatorsAliases: false,
    pool: {
      max: config.get("db.pool.max"),
      min: config.get("db.pool.min"),
      acquire: config.get("db.pool.acquire"),
      idle: config.get("db.pool.idle"),
    },
  }
);

const models = {
  sequelize,
};

// models
models.users = require("./User.js").model(sequelize);
models.proposals = require("./Proposal.js").model(sequelize);
models.votes = require("./Vote.js").model(sequelize);

module.exports = models;
