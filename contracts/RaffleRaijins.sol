//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RaffleRaijins is Ownable {

    struct RaffleInfo {
        string  value;
        int256  winnerIndex;
        address winner;
        uint256 totalTicketCnt;
        mapping(uint256 => address) userAddressPerTicket;
        mapping(address => uint256) ticketCntPerUser;
        bool    isDecided;
        bool    isDisabled;
        uint256 timeStarted;
        uint256 timeDecided;
    }

    struct RaffleStatus {
        string  value;
        int256  winnerIndex;
        address winner;
        uint256 totalTicketCnt;
        uint256 ticketCntForUser;
        bool    isDecided;
        bool    isDisabled;
        uint256 timeStarted;
        uint256 timeDecided;
    }

    IERC20 public   raijinsTicketAddress;
    uint256 public  period;
    uint256 public  waitingPeriod;
    uint256 public  cntRaffles;
    mapping(uint256 => RaffleInfo) public raffleInfo;

    event WithdrawAll(address _address);

    receive() payable external {}

    constructor(address initialOwner) Ownable(initialOwner) {
        raijinsTicketAddress = IERC20(0xd22bdF42215144Cf46F1725431002a5a388e3E6E);
        cntRaffles = 21;
        period = 2160000; // 3600 * 24 * 25
        waitingPeriod = 432000; // 3600 * 24 * 5
    }

    function withdrawRaijinsTicket() public onlyOwner returns (bool) {
        uint256 balance = raijinsTicketAddress.balanceOf(address(this));
        return raijinsTicketAddress.transfer(msg.sender, balance);
    }

    function setRaijinsTicketAddress(address _address) public onlyOwner {
        raijinsTicketAddress = IERC20(_address);
    }

    function setRaffleCount(uint256 _cntRaffles) public onlyOwner {
        cntRaffles = _cntRaffles;
    }

    function setPeriodToDeposit(uint256 _period) public onlyOwner {
        period = _period;
    }

    function setWaitingPeriodForNextRaffle(uint256 _waitingPeriod) public onlyOwner {
        waitingPeriod = _waitingPeriod;
    }

    function setRaffleValue(uint256 _raffleIndex, string memory _raffleValue) public onlyOwner {
        raffleInfo[_raffleIndex].value = _raffleValue;
    }

    function setRaffleDisable(uint256 _raffleIndex, bool _isDisabled) public onlyOwner {
        raffleInfo[_raffleIndex].isDisabled = _isDisabled;
    }

    function startRaffles() public onlyOwner {
        for (uint256 i = 0; i < cntRaffles; i ++) {
            for (uint256 j = 0; j < raffleInfo[i].totalTicketCnt; j ++) {
                address user = raffleInfo[i].userAddressPerTicket[j];
                raffleInfo[i].ticketCntPerUser[user] = 0;
            }
            raffleInfo[i].totalTicketCnt = 0;
            raffleInfo[i].winnerIndex = -1;
            raffleInfo[i].winner = address(0);
            raffleInfo[i].isDecided = false;
            raffleInfo[i].timeStarted = block.timestamp;
        }
    }

    function decideWinners() public onlyOwner {
        for (uint256 i = 0; i < cntRaffles; i ++) {
            if (raffleInfo[i].totalTicketCnt > 0) {
                uint256 winnerIndex = getRandomNumber(i, raffleInfo[i].totalTicketCnt);
                raffleInfo[i].winnerIndex = int256(winnerIndex);
                raffleInfo[i].winner = raffleInfo[i].userAddressPerTicket[winnerIndex];
            }
            raffleInfo[i].isDecided = true;
            raffleInfo[i].timeDecided = block.timestamp;
        }
    }

    function getRandomNumber(uint256 _indexRaffle, uint256 _totalTickets) public view returns (uint256) {
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, _indexRaffle, _totalTickets, address(this))));
        return seed % _totalTickets;
    }

    function addTicket(uint256 _indexRaffle, uint256 _ticketCnt) public {
        require(raffleInfo[_indexRaffle].timeStarted < block.timestamp, "Not started Rafflet yet!");
        require(raffleInfo[_indexRaffle].timeStarted + period > block.timestamp, "Passed Raffle Time!");
        require(!raffleInfo[_indexRaffle].isDecided, "Finished Raffle");
        require(!raffleInfo[_indexRaffle].isDisabled, "Disabled Raffle");
        require(_indexRaffle < cntRaffles, "Invalid Raffle Index");
        require(_ticketCnt > 0, "Invalid Ticket Count");

        for (uint256 i = 0; i < _ticketCnt; i ++) {
            raffleInfo[_indexRaffle].userAddressPerTicket[raffleInfo[_indexRaffle].totalTicketCnt] = msg.sender;
            raffleInfo[_indexRaffle].totalTicketCnt ++;
        }
        raijinsTicketAddress.transferFrom(msg.sender, address(this), _ticketCnt * 10 ** 18);
        raffleInfo[_indexRaffle].ticketCntPerUser[msg.sender] += _ticketCnt;
    }

    function getRaffleInfo(address _userAccount) public view returns (RaffleStatus[] memory _rafflesForUser)
    {
        _rafflesForUser = new RaffleStatus[](cntRaffles);

        for (uint256 i = 0; i < cntRaffles; i ++) {
            _rafflesForUser[i].value = raffleInfo[i].value;
            _rafflesForUser[i].winnerIndex = raffleInfo[i].winnerIndex;
            _rafflesForUser[i].winner = raffleInfo[i].winner;
            _rafflesForUser[i].totalTicketCnt = raffleInfo[i].totalTicketCnt;
            _rafflesForUser[i].ticketCntForUser = raffleInfo[i].ticketCntPerUser[_userAccount];
            _rafflesForUser[i].isDecided = raffleInfo[i].isDecided;
            _rafflesForUser[i].isDisabled = raffleInfo[i].isDisabled;
            _rafflesForUser[i].timeStarted = raffleInfo[i].timeStarted;
            _rafflesForUser[i].timeDecided = raffleInfo[i].timeDecided;
        }
    }
}