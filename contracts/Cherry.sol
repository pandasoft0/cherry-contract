pragma solidity ^0.6.0;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Cherry is ERC20, Ownable
{
	constructor() public
	{
		super.constructor("Cherry", "CHERRY");
	}

	function burn(uint256 amount) public virtual
	{
		_burn(_msgSender(), amount);
	}

	function mint(address account, uint256 amount) public virtual onlyOwner
	{
		_mint(account, amount);
	}

	function batchMint(address[] accounts, uint256[] amounts) public virtual onlyOwner
	{
		require(accounts.length == amounts.length, "Accounts length != amounts length");

		for (uint256 idx = 0; idx < accounts.length; idx++)
		{
			_mint(accounts[idx], amounts[idx]);
		}
	}

	function batchTransfer(address[] recipients, uint256[] amounts) public virtual
	{
		require(recipients.length == amounts.length, "Account length != amount length");

		address sender = _msgSender();
		for (uint256 idx = 0; idx < recipients.length; idx++)
		{
			_transfer(sender, recipients[idx], amounts[idx])
		}
	}
}
