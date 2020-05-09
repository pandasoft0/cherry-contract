pragma solidity ^0.6.0;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Cherry is ERC20, Ownable
{
	constructor(string memory name, string memory symbol) ERC20(name, symbol) public {}

	function burn(uint256 amount) public virtual
	{
		_burn(_msgSender(), amount);
	}

	function mint(address account, uint256 amount) public virtual onlyOwner
	{
		_mint(account, amount);
	}

	function batchMint(address[] memory accounts, uint256[] memory amounts) public virtual onlyOwner
	{
		require(accounts.length == amounts.length, "Accounts length != amounts length");

		for (uint256 idx = 0; idx < accounts.length; idx++)
		{
			_mint(accounts[idx], amounts[idx]);
		}
	}

	function batchTransfer(address[] memory recipients, uint256[] memory amounts) public virtual
	{
		require(recipients.length == amounts.length, "Account length != amount length");

		address sender = _msgSender();
		for (uint256 idx = 0; idx < recipients.length; idx++)
		{
			_transfer(sender, recipients[idx], amounts[idx]);
		}
	}
}
