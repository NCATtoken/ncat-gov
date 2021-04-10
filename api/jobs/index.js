"use strict";

const cron = require("node-cron");
const updateProposals = require("./update-proposals");

// Every hour
const everyHour = "0 * * * *";

const jobs = {
  updateProposals: cron.schedule(everyHour, updateProposals),
};

const start = (job) => {
  if (Object.hasOwnProperty.call(jobs, job)) {
    jobs[job].start();
  } else throw new Error("Unknown job");
};

const stop = (job) => {
  if (Object.hasOwnProperty.call(jobs, job)) {
    jobs[job].stop();
  } else throw new Error("Unknown job");
};

module.exports = {
  startAll: () => {
    for (const job in jobs) {
      start(job);
    }
  },
  stopAll: () => {
    for (const job in jobs) {
      stop(job);
    }
  },
  start,
  stop,
};
