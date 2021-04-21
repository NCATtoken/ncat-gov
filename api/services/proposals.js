"use strict";

const config = require("config");
const { sequelize } = require("../models");
const repository = require("../repositories/proposals");
const usersRepository = require("../repositories/users");

const createError = require("http-errors");
const { assertNotBlackListed } = require("../utils/utils");
const DECIMALS = config.get("blockchain.ncat.decimals");

const { MIN_PROPOSAL_BALANCE } = require("../models/User");
const { BigNumber } = require("ethers");
const { PROPOSAL_STATES, PROPOSAL_EXPIRATION_PERIOD } = require("../models/Proposal");
const logger = require("../utils/logger");

const findAllByPage = (page) => repository.findAllByPage(page);

const save = async (proposal) => {
  const author = proposal.author;
  assertNotBlackListed(author);
  const t = await sequelize.transaction();
  try {
    let user = await usersRepository.findByAddress(author, t, true);
    if (!user) {
      user = await usersRepository.save({ address: author }, t);
    }
    const canPropose = await user.canPropose();
    if (!canPropose) {
      throw createError(
        400,
        `You should own at least ${MIN_PROPOSAL_BALANCE.div(
          DECIMALS
        ).toString()} NCAT to create a proposal`
      );
    }
    await repository.save(
      {
        title: proposal.title,
        author: proposal.author,
        content: proposal.content,
      },
      t
    );
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const updateStates = async () => {
  const proposals = (await repository.findAll()).filter(
    (proposal) => proposal.state === PROPOSAL_STATES.PENDING
  );
  const now = new Date().getTime();
  const t = await sequelize.transaction();
  return Promise.all(
    proposals.map((proposal) => {
      if (now > proposal.expiration.getTime()) {
        const forVotes = BigNumber.from(proposal.for);
        const againstVotes = BigNumber.from(proposal.against);
        const newState = forVotes.gt(againstVotes)
          ? PROPOSAL_STATES.ACCEPTED
          : PROPOSAL_STATES.REJECTED;
        return repository.updateById(
          proposal.id,
          {
            state: newState,
          },
          t
        );
      }
    })
  )
    .then(() => t.commit())
    .catch((err) => {
      logger.error("Unexpected error when updating proposals: %O", err);
      return t.rollback();
    });
};

module.exports = {
  findAllByPage,
  save,
  updateStates,
};
