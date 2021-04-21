"use strict";

if (process.env.IS_DOCKER === undefined) require("dotenv/config");

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const config = require("config");
const path = require("path");
const rfs = require("rotating-file-stream");
const cors = require("cors");

const models = require("./models");
const logger = require("./utils/logger");
const listeners = require("./listeners");
const jobs = require("./jobs");
const jwtauth = require("./middleware/jwtauth");
const accessLogStream = rfs.createStream("access.log", {
  interval: config.get("logging.rotation"),
  path: path.join(__dirname, config.get("logging.folder")),
});

const app = express();
const appPort = config.get("port");

app.use(cors());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../assets')));

// routes
require("./routes")(app, logger);


// home
app.get('/', jwtauth, (req, res) => {
  res.send({ version: '1.0', user: req.user });
})

// Synchronize DB
models.sequelize.sync().then(async () => {
  //listeners.enableAll();
  jobs.startAll();
  app.listen(appPort, () => {
    logger.info(`App is listening on port ${appPort}`);
  });
});
