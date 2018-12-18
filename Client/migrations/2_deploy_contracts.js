var Expense = artifacts.require("Expense");

module.exports = function(deployer) {
  deployer.deploy(Expense);
};
