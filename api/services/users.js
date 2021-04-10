const repository = require("../repositories/users");
const { assertNotBlackListed } = require("../utils/utils");

module.exports.updateDelegatee = async (userAddress, delegatee) => {
  assertNotBlackListed(userAddress);
  assertNotBlackListed(delegatee);
  await repository.updateByAddress(userAddress, { delegatee });
};
