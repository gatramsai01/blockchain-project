var Timestamping = artifacts.require("./Timestamping.sol");

module.exports = function(deployer) {
  deployer.deploy(Timestamping);
};
