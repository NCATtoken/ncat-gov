"use strict";

const logger = require("../utils/logger");
const { updateStates } = require("../services/proposals");

module.exports = async () => {
  logger.info("Updating proposals...");
  await updateStates();
};
