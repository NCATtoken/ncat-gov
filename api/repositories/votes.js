"use strict";
const { UniqueConstraintError } = require("sequelize");
const createError = require("http-errors");

const { votes } = require("../models");

module.exports.save = (fields, transaction) => {
  return votes.create(fields, transaction).catch((e) => {
    if (e instanceof UniqueConstraintError) {
      throw createError(400, "You've already voted");
    } else throw e;
  });
};

module.exports.findAll = () => votes.findAll();

module.exports.findById = (id, transaction, lock = false) => {
  return votes.findOne({ where: { id } }, transaction, lock);
};

module.exports.updateById = (id, fields, transaction) => {
  return votes.update(fields, {
    where: {
      id,
    },
    transaction,
  });
};

