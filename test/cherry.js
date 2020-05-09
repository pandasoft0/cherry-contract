/*global artifacts, assert, before, contract, it, web3*/

const truffleAssert = require('truffle-assertions');

const Cherry = artifacts.require('./Cherry.sol');

// Helpers
const bn = num => web3.utils.toBN(num);

contract('Cherry Contract', async (accounts) => {
  let contract;
  const name = 'Cherry';
  const symbol = 'CHERRY';

  before(async () => {
    contract = await Cherry.deployed();
  });

  it('contract name and symbol should match expected deployed values', async () => {
    const _name = await contract.name();
    const _symbol = await contract.symbol();
    assert.equal(name, _name);
    assert.equal(symbol, _symbol);
  });

  /*
  it('options counts and prices should be migrated properly', async () => {
    const numOptions = await contract.numOptions();
    assert.equal(numOptions, initialConfig.optionCount);
    for (let i = 0; i < initialConfig.optionCount; i++) {
      // eslint-disable-next-line no-await-in-loop
      const boxes = await contract.purchaseOptions(i);
      assert.isOk(boxes.eq(bn(initialConfig.optionValues[i])));
      // eslint-disable-next-line no-await-in-loop
      const price = await contract.purchasePrices(boxes);
      assert.isOk(price.eq(bn(initialConfig.optionPrices[i])));
    }
  });

  it('should purchase the correct option, without uuid', async () => {
    const opt = 1000;
    const priceWei = await contract.purchasePrices(opt);
    const tx = await contract.purchase(opt, web3.utils.fromAscii(''), { from: accounts[1], value: priceWei });
    truffleAssert.eventEmitted(
      tx,
      'OptionPurchased',
      ev => ev.buyer === accounts[1]
        && ev.option.eq(web3.utils.toBN(opt))
        && web3.utils.toAscii(ev.uuid).replace(/\0/g, '') == ''
    );
  });

  it('should not purchase for wrong price', async () => {
    const opt = 1000;
    const opt_price = 30;
    const priceWei = await contract.purchasePrices(opt_price);
    try {
      await contract.purchase(opt, web3.utils.fromAscii(''), { from: accounts[5], value: priceWei });
      assert.fail('It should not be possible to buy with the wrong price');
    } catch (_) {
      // eslint-disable-previous-line no-empty
    }
  });

  // This goes before the (successful) owner attempt so there's Ether in the
  // contract and any failure is not due to lack of funds

  it('should allow owner to withdraw', async () => {
    const contractBalance = await web3.eth.getBalance(contract.address);
    assert.ok(
      !web3.utils.toBN(contractBalance).eq(web3.utils.toBN(0)),
      'no funds to test withdrawal with'
    );
    const accountBalance = await web3.eth.getBalance(accounts[0]);
    // The account won't simply be higher after withdrawing because gas
    // will be taken from it.
    const gasAmount = bn(await contract.withdraw.estimateGas(contractBalance));
    const gasPrice = bn(await web3.eth.getGasPrice());
    const gas = gasPrice.mul(gasAmount);
    try {
      await contract.withdraw(contractBalance);
    } catch (_) {
      assert.fail('Owner should be able to withdraw');
    }
    const newAccountBalance = bn(await web3.eth.getBalance(accounts[0]));
    assert.isOk(newAccountBalance.gt(accountBalance.sub(gas)));
  });

  it('should not allow non-owner to pause contract', async () => {
    try {
      await contract.pause({ from: accounts[1] });
      assert.fail('Non-owner pausing should error');
    } catch (_) {
      // eslint-disable-previous-line no-empty
    }
    try {
      await contract.unpause({ from: accounts[1] });
      assert.fail('Non-owner pausing should error');
    } catch (_) {
      // eslint-disable-previous-line no-empty
    }
  });
  */
});
