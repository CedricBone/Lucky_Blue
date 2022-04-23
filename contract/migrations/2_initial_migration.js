const BlueCoin = artifacts.require("BlueCoin");

module.exports = function (deployer) {
    deployer.deploy(BlueCoin, 1000);
};