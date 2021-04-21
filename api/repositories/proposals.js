"use strict";
const { UniqueConstraintError } = require("sequelize");
const createError = require("http-errors");
const { proposals } = require("../models");
const MAX_PER_PAGE = 10;

module.exports.save = (fields, transaction) => {
  return proposals.create(fields, transaction).catch((e) => {
    if (e instanceof UniqueConstraintError) {
      throw createError(400, "Proposal with same title already exists");
    } else throw e;
  });
};

module.exports.findAllByPage = (page, transaction, lock = false) =>
  proposals.findAll(
    { limit: MAX_PER_PAGE, offset: page * MAX_PER_PAGE, order: [['expiration', 'asc']] },
    transaction,
    lock
  );

module.exports.findAll = (transaction, lock = false) =>
  proposals.findAll(transaction, lock);

module.exports.findById = (id, transaction, lock = false) => {
  return proposals.findOne({ where: { id } }, transaction, lock);
};

module.exports.updateById = (id, fields, transaction) => {
  return proposals.update(fields, {
    where: {
      id,
    },
    transaction,
  });
};
