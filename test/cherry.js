/*global artifacts, assert, before, contract, it, web3*/

const truffleAssert = require('truffle-assertions');
const expectThrow = require('./helpers/expectThrow.js');

const Cherry = artifacts.require('./Cherry.sol');

// Helpers
const bn = num => web3.utils.toBN(num);
const fromWei = (number, unit) => web3.utils.fromWei(bn(number), unit);
const toWei = (number, unit) => web3.utils.toWei(bn(number), unit);

contract('Cherry Contract', async (accounts) => {
  let contract;
  const name = 'Cherry';
  const symbol = 'CHERRY';

  const owner = accounts[0];
  const player1 = accounts[1];
  const player2 = accounts[2];

  let supply = 0;

  before(async () => {
    contract = await Cherry.deployed();
  });

  it('contract name and symbol should match expected deployed values', async () => {
    const _name = await contract.name();
    const _symbol = await contract.symbol();
    assert.equal(name, _name);
    assert.equal(symbol, _symbol);
  });

  it('should start with 0 supply', async () => {
    assert.equal(0, await contract.totalSupply());
  });

  it('should not allow non-owner to mint to other non-owner', async () => {
    () => expectThrow(contract.mint(player2, toWei(500,'ether'), {from:player1}))
  });

  it('should not allow non-owner to mint to self', async () => {
    () => expectThrow(contract.mint(player1, toWei(500,'ether'), {from:player1}))
  });

  it('should not allow non-owner to mint to owner', async () => {
    () => expectThrow(contract.mint(owner, toWei(500,'ether'), {from:player1}))
  });

  it('should allow owner to mint to self', async () => {
    await contract.mint(owner, toWei(10,'ether'), {from:owner});
    assert(toWei(10,'ether').eq(await contract.totalSupply()));
  });

  it('should allow owner to mint to others', async () => {
    await contract.mint(player2, toWei(10,'ether'), {from:owner});
    assert(toWei(20,'ether').eq(await contract.totalSupply()));
  });

  it('should not allow non-owner to batch mint', async () => {
    () => expectThrow(contract.batchMint([owner,player1,player2], [toWei(500,'ether'),toWei(500,'ether'),toWei(500,'ether')], {from:player1}))
  });

  it('should allow owner to batch mint to self and two others', async () => {
    await contract.batchMint([owner,player1,player2], [toWei(10,'ether'),toWei(10,'ether'),toWei(10,'ether')], {from:owner});
    assert(toWei(50,'ether').eq(await contract.totalSupply()));
  });

  it('should require same number of elements in both arguments for batch mint', async () => {
    () => expectThrow(contract.batchMint([owner,player1,player2], [toWei(500,'ether'),toWei(500,'ether')], {from:owner}))
  });

  it('all token holders should have expected amounts', async () => {
    assert(toWei(20,'ether').eq(await contract.balanceOf(owner)));
    assert(toWei(10,'ether').eq(await contract.balanceOf(player1)));
    assert(toWei(20,'ether').eq(await contract.balanceOf(player2)));
  });

  it('should allow owner to burn some of their own token', async () => {
    await contract.burn(toWei(5,'ether'), {from:owner});
    assert(toWei(45,'ether').eq(await contract.totalSupply()));
    assert(toWei(15,'ether').eq(await contract.balanceOf(owner)));
    assert(toWei(10,'ether').eq(await contract.balanceOf(player1)));
    assert(toWei(20,'ether').eq(await contract.balanceOf(player2)));
  });

  it('should allow player1 to burn some of their own token', async () => {
    await contract.burn(toWei(5,'ether'), {from:player1});
    assert(toWei(40,'ether').eq(await contract.totalSupply()));
    assert(toWei(15,'ether').eq(await contract.balanceOf(owner)));
    assert(toWei(5,'ether').eq(await contract.balanceOf(player1)));
    assert(toWei(20,'ether').eq(await contract.balanceOf(player2)));
  });

  it('should not allow owner to burn more than they have', async () => {
    () => expectThrow(contract.burn(toWei(40,'ether'), {from:owner}))
  });

  it('should not allow player1 to burn more than they have', async () => {
    () => expectThrow(contract.burn(toWei(40,'ether'), {from:player1}))
  });

  it('all token holders should have expected amounts', async () => {
    assert(toWei(40,'ether').eq(await contract.totalSupply()));
    assert(toWei(15,'ether').eq(await contract.balanceOf(owner)));
    assert(toWei(5,'ether').eq(await contract.balanceOf(player1)));
    assert(toWei(20,'ether').eq(await contract.balanceOf(player2)));
  });

  it('should allow owner to batch transfer some of their own token', async () => {
    await contract.batchTransfer([player1,player2], [toWei(5,'ether'),toWei(5,'ether')], {from:owner});
    assert(toWei(40,'ether').eq(await contract.totalSupply()));
    assert(toWei(5,'ether').eq(await contract.balanceOf(owner)));
    assert(toWei(10,'ether').eq(await contract.balanceOf(player1)));
    assert(toWei(25,'ether').eq(await contract.balanceOf(player2)));
  });

  it('should allow player2 to batch transfer some of their own token', async () => {
    await contract.batchTransfer([owner,player1], [toWei(5,'ether'),toWei(5,'ether')], {from:player2});
    assert(toWei(40,'ether').eq(await contract.totalSupply()));
    assert(toWei(10,'ether').eq(await contract.balanceOf(owner)));
    assert(toWei(15,'ether').eq(await contract.balanceOf(player1)));
    assert(toWei(15,'ether').eq(await contract.balanceOf(player2)));
  });

  it('should not allow owner to batch tranfer more than they have', async () => {
    () => expectThrow(contract.batchTranfer([player1,player2], [toWei(5,'ether'),toWei(50,'ether')], {from:owner}))
  });

  it('should not allow player1 to batch tranfer more than they have', async () => {
    () => expectThrow(contract.batchTranfer([owner,player2], [toWei(5,'ether'),toWei(50,'ether')], {from:player1}))
  });

  it('should not allow player1 to batch tranfer to themselves', async () => {
    () => expectThrow(contract.batchTranfer([owner,player1], [toWei(5,'ether'),toWei(5,'ether')], {from:player1}))
  });

  it('should require same number of elements in both arguments for batch transfer', async () => {
    () => expectThrow(contract.batchMint([owner,player1], [toWei(5,'ether')], {from:player2}))
  });

  it('should allow owner to burn remainder of their own token', async () => {
    await contract.burn(toWei(10,'ether'), {from:owner});
    assert(toWei(30,'ether').eq(await contract.totalSupply()));
    assert(toWei(0,'ether').eq(await contract.balanceOf(owner)));
    assert(toWei(15,'ether').eq(await contract.balanceOf(player1)));
    assert(toWei(15,'ether').eq(await contract.balanceOf(player2)));
  });

  it('should allow player1 to burn remainder of their own token', async () => {
    await contract.burn(toWei(15,'ether'), {from:player1});
    assert(toWei(15,'ether').eq(await contract.totalSupply()));
    assert(toWei(0,'ether').eq(await contract.balanceOf(owner)));
    assert(toWei(0,'ether').eq(await contract.balanceOf(player1)));
    assert(toWei(15,'ether').eq(await contract.balanceOf(player2)));
  });

  it('should allow player2 to burn remainder of their own token, zeroing out supply', async () => {
    await contract.burn(toWei(15,'ether'), {from:player2});
    assert(toWei(0,'ether').eq(await contract.totalSupply()));
    assert(toWei(0,'ether').eq(await contract.balanceOf(owner)));
    assert(toWei(0,'ether').eq(await contract.balanceOf(player1)));
    assert(toWei(0,'ether').eq(await contract.balanceOf(player2)));
  });

});
