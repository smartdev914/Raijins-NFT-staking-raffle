//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPriceFeedExt {
    function latestAnswer() external view returns (int256 priceInfo);
}

contract RaijinsTicketRouter is Ownable {
    IERC20 public _raijinsTicketAddress;
    uint256 public raijinsTicketPrice_USD;

    mapping (address => uint256) private _userPaid_MATIC;
    IPriceFeedExt public priceFeed_MATIC;
    
    address private teamAddress;

    event BuyRaijinsTicket(address _from, address _to, uint256 _amount);
    event WithdrawAll(address addr);

    receive() payable external {}
    fallback() payable external {}

    constructor(address initialOwner) Ownable(initialOwner) {
        _raijinsTicketAddress = IERC20(0xd22bdF42215144Cf46F1725431002a5a388e3E6E);

        priceFeed_MATIC = IPriceFeedExt(0xAB594600376Ec9fD91F8e885dADF0CE036862dE0);

        raijinsTicketPrice_USD = 0.35 * 10 ** 8; // 35 Cents per ticket

        teamAddress = msg.sender;
    }

    function buyRaijinsTicketsByMATIC() external payable {
        require(msg.value > 0, "Insufficient MATIC amount");
        uint256 amountPrice = getLatestMATICPrice() * msg.value;

        // raijinsTicket amount user want to buy
        uint256 raijinsTicketAmount = amountPrice / raijinsTicketPrice_USD;

        // transfer raijinsTicket to user
        _raijinsTicketAddress.transfer(msg.sender, (raijinsTicketAmount > 5 * 10 ** 17) ? (raijinsTicketAmount + 10 ** 16): raijinsTicketAmount);

        // add USD user bought
        _userPaid_MATIC[msg.sender] += amountPrice;

        // transfer MATIC to teamAddress
        payable(teamAddress).transfer(msg.value);

        emit BuyRaijinsTicket(address(this), msg.sender, raijinsTicketAmount);
    }

    function buyRaijinsTicketsByMATICWithReferral(address toReward) external payable {
        require(msg.value > 0, "Insufficient MATIC amount");
        uint256 amountPrice = getLatestMATICPrice() * msg.value;

        // raijinsTicket amount user want to buy
        uint256 raijinsTicketAmount = amountPrice / raijinsTicketPrice_USD;

        // transfer raijinsTicket to user
        _raijinsTicketAddress.transfer(msg.sender, (raijinsTicketAmount > 5 * 10 ** 17) ? (raijinsTicketAmount + 10 ** 16): raijinsTicketAmount);

        // transfer reward to referral provider
        payable(toReward).transfer(msg.value * 5 / 100);

        // transfer MATIC to teamAddress
        payable(teamAddress).transfer(msg.value * 95 / 100);

        // add USD user bought
        _userPaid_MATIC[msg.sender] += amountPrice;

        emit BuyRaijinsTicket(address(this), msg.sender, raijinsTicketAmount);
    }

    function getLatestMATICPrice() public view returns (uint256) {
        return uint256(priceFeed_MATIC.latestAnswer());
    }

    function withdrawAll() external onlyOwner {
        uint256 MATICbalance = address(this).balance;
        
        if (MATICbalance > 0)
            payable(owner()).transfer(MATICbalance);

        emit WithdrawAll(msg.sender);
    }

    function withdrawRaijinsTicket() public onlyOwner returns (bool) {
        uint256 balance = _raijinsTicketAddress.balanceOf(address(this));
        return _raijinsTicketAddress.transfer(msg.sender, balance);
    }

    function getUserPaidMATIC () public view returns (uint256) {
        return _userPaid_MATIC[msg.sender];
    }

    function setRaijinsTicketAddress(address _address) public onlyOwner {
        _raijinsTicketAddress = IERC20(_address);
    }

    /* Price Decimal is 8 */
    function setRaijinsTicketPriceByUSD(uint256 _raijinsTicketPrice) public onlyOwner {
        raijinsTicketPrice_USD = _raijinsTicketPrice;
    }

    function setTeamAddress(address _teamAddress) public onlyOwner {
        teamAddress = _teamAddress;
    }
}