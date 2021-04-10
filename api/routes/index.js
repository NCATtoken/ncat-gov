"use strict";

module.exports = (app, logger) => {
  app.use("/proposals", require("./proposals"));

  // error handler
  app.use(function (err, req, res, next) {
    if (!err.status || err.status >= 500) {
      logger.error("unhandled error occured: %O", err);
      res.status(500).json({ message: "Internal server error" });
    } else {
      logger.warn(err.message);
      res.status(err.status).json({ message: err.message });
    }
  });
};
