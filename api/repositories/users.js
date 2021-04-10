"use strict";

const { users } = require("../models");

module.exports.save = (fields, transaction) => {
  return users.create(fields, transaction);
};

module.exports.findAll = () => users.findAll();

module.exports.findByAddress = (address, transaction, lock = false) => {
  return users.findOne({ where: { address } }, transaction, lock);
};

module.exports.updateByAddress = (address, fields, transaction) => {
  return users.update(fields, {
    where: {
      address,
    },
    transaction,
  });
};
