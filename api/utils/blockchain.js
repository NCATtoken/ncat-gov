"use strict";

const { Contract, utils, getDefaultProvider } = require("ethers");

const config = require("config");

const NCAT_ADDRESS = config.get("blockchain.ncat.address");
const NCAT_ABI = config.get("blockchain.ncat.abi");
const NETWORK = config.get("blockchain.network");

const defaultProvider = getDefaultProvider(NETWORK);

const roContract = new Contract(NCAT_ADDRESS, NCAT_ABI, defaultProvider);

const isValidAddress = (addr) => {
  try {
    utils.getAddress(addr);
    return true;
  } catch (error) {
    return false;
  }
};

const getLatestBlockNumber = () => {
  return defaultProvider.getBlockNumber();
};

const balanceOf = (address) => roContract.balanceOf(address);

module.exports = {
  defaultProvider,
  roContract,
  balanceOf,
  isValidAddress,
  getLatestBlockNumber,
};
