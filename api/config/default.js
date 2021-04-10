"use strict";

module.exports = {
  port: 3000,
  logging: {
    level: "info",
    folder: ".//logs//",
    file: "app-%DATE%.log",
    rotation: "7d", // rotate weekly
  },
  db: {
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: "postgres",
    pool: {
      max: 60,
      min: 10,
      acquire: 30000,
      idle: 10000,
    },
    logs: false, // SQL logs
  },
  blockchain: {
    network: "https://bsc-dataseed.binance.org/",
    blacklisted: [].map((a) => a.toLowerCase()), // blacklisted addresses
    ncat: {
      address: "0x0cf011a946f23a03ceff92a4632d5f9288c6c70d",
      decimals: 9,
      abi: require("./NCAT.json"),
    },
  },
};
