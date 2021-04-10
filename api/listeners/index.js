"use strict";

const transfers = require("./transfers");
// const { getLatestBlockNumber, roContract } = require("../utils/blockchain");

// const history = async () => {
//   const latestBlock = await getLatestBlockNumber();
//   const logs = await roContract.queryFilter(
//     roContract.filters.Transfer(),
//     latestBlock - 5000,
//     latestBlock
//   );

//   logs.map((log) => {
//     console.log(log);
//   });
// };

const listeners = {
  transfers,
};

let enabled = {};

const enable = (listener) => {
  if (enabled[listener]) return;
  if (Object.hasOwnProperty.call(listeners, listener)) {
    listeners[listener]();
    enabled[listener] = true;
  } else throw new Error("Unknown listener");
};

module.exports = {
  enableAll: () => {
    for (const listener in listeners) {
      enable(listener);
    }
  },
  enable,
};
