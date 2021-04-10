"use strict";

const createError = require("http-errors");
const config = require("config");
const BLACKLISTED_ADDRESSES = config.get("blockchain.blacklisted");

const assertNotBlackListed = (address) => {
  if (BLACKLISTED_ADDRESSES.includes(address.toLowerCase()))
    throw createError(400, `Blacklisted address ${address}`);
};

module.exports = {
  assertNotBlackListed,
};
