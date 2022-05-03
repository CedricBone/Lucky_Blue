const BlueCoin = artifacts.require("BlueCoin");

module.exports = function (deployer) {
    deployer.deploy(BlueCoin, 100000);
};