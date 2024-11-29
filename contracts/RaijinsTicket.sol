// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RaijinsTicket is ERC20, Ownable {
    constructor() ERC20("Raijins Ticket", "RJT") Ownable(msg.sender) {
        _mint(msg.sender, 10000000 * 10 ** 18);
    }
}