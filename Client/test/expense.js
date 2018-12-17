const Expense = artifacts.require("./Expense.sol");

contract('Expense', accounts => {

  let instance

  beforeEach(async () => {
    instance = await Expense.deployed()
  })

  it("initializes with no transactions", async () => {
    let count = await instance.totalTransactions()
    assert.equal(count, 0)
  })


  it("add and get transaction as intended", async () => {
    await instance.addTransaction('food', 'sate padang', 'asdas.co', 123456, 'OK', 'asdasd@asd.com', { from: accounts[0] })
    const newTransaction = await instance.transactions(0)
    assert.equal(newTransaction[0], 1, 'contains the correct id')
    assert.equal(newTransaction[1], 'food', 'contains the correct category')
    assert.equal(newTransaction[2], 'sate padang', 'contains the correct id')
    assert.equal(newTransaction[3], 'asdas.co', 'contains the correct bill image url')
    assert.equal(newTransaction[4], 123456, 'contains the correct bill image nominal')
    assert.equal(newTransaction[5], 'OK', 'contains the correct status')
    assert.equal(newTransaction[6], 'asdasd@asd.com', 'contains the correct email')
    assert.equal(newTransaction[7], accounts[0], 'contains the correct message sender')
  })

  it("add and get adjustment transaction as intended", async () => {
    await instance.addTransaction('adjustment', 'sate padang', 'asdas.co', -100000, 'OK', 'asdasd@asd.com', { from: accounts[0] })
    const newTransaction = await instance.transactions(1)
    assert.equal(newTransaction[0], 2, 'contains the correct id')
    assert.equal(newTransaction[1], 'adjustment', 'contains the correct category')
    assert.equal(newTransaction[2], 'sate padang', 'contains the correct id')
    assert.equal(newTransaction[3], 'asdas.co', 'contains the correct bill image url')
    assert.equal(newTransaction[4], -100000, 'contains the correct bill image nominal')
    assert.equal(newTransaction[5], 'OK', 'contains the correct status')
    assert.equal(newTransaction[6], 'asdasd@asd.com', 'contains the correct email')
    assert.equal(newTransaction[7], accounts[0], 'contains the correct message sender')
  })

})
