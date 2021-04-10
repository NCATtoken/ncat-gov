"use strict"

const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const config = require("config");

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.splat(),
  winston.format.align(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);
const transport = new DailyRotateFile({
  filename: config.get("logging.folder") + config.get("logging.file"),
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: config.get("logging.rotation"),
  prepend: true,
  level: config.get("logging.level"),
});

transport.on("rotate", function (oldFilename, newFilename) {
  // TODO: call function like upload to s3 or on cloud
});

const logger = winston.createLogger({
  format: logFormat,
  transports: [
    transport,
    new winston.transports.Console({
      level: "info",
    }),
  ],
});

module.exports = logger;
