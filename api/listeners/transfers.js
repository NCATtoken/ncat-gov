"use strict";
const logger = require("../utils/logger");
const { roContract, balanceOf } = require("../utils/blockchain");

// @TODO : do smthg when a voter transfers his tokens
module.exports = () => {
  roContract.on("Transfer", async (a, b, c, { args }) => {
    logger.info("Transfer detected: %O", args);
  });
};
