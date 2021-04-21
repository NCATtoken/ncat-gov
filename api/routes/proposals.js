"use strict";

const router = require("express").Router();
const logger = require("../utils/logger");
const { isValidAddress } = require("../utils/blockchain");
const { findAllByPage, save } = require("../services/proposals");
const { vote } = require("../services/votes");

const createError = require("http-errors");
const { check, validationResult } = require("express-validator");

router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const proposals = await findAllByPage(page);
    res.json({ proposals });
  } catch (e) {
    next(e);
  }
});

router.post(
  "/",
  [
    check("title").isString(),
    check("title").isLength({ max: 255 }),
    check("title").not().isEmpty({ ignore_whitespace: true }),
    check("content").isString(),
    check("content").not().isEmpty({ ignore_whitespace: true }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    if (!isValidAddress(req.user.address))
      next(createError(400, "Invalid address"));
    try {
      const proposal = {
        author: req.user.address,
        title: req.body.title.trim(),
        content: req.body.content.trim(),
      };
      await save(proposal);
      res.json({ message: "success", proposal });
    } catch (e) {
      next(e);
    }
  }
);

router.get("/vote", async (req, res, next) => {
  const voter = req.user.address;
  const proposalId = req.query.proposalId;
  let support = req.query.support;
  if (!["true", "false"].includes(support)) {
    next(createError(400, "support attribute is invalid"));
  }
  support = support === "true" ? true : false;
  if (!voter) {
    next(createError(400, "address is not specified"));
  }
  if (proposalId === undefined) {
    next(createError(400, "proposalId is not specified"));
  }

  logger.info(
    `${voter} is voting ${support ? "for" : "against"} proposal: ${proposalId}`
  );

  if (!isValidAddress(voter)) next(createError(400, "Invalid address"));

  try {
    await vote(voter, proposalId, support);
    res.json({ message: "success" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
