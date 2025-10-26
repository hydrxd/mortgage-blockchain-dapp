// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Mortgage {
    struct MortgageInfo {
        address borrower;
        uint256 amount;
        uint256 paidAmount;
        bool approved;
    }

    mapping(uint256 => MortgageInfo) public mortgages;
    uint256 public mortgageCount;
    address public bank;

    event MortgageCreated(uint256 id, address borrower, uint256 amount);
    event MortgageApproved(uint256 id);
    event MortgagePaid(uint256 id, uint256 amount);

    modifier onlyBank() {
        require(msg.sender == bank, "Only bank can approve");
        _;
    }

    constructor() {
        bank = msg.sender;
    }

    function createMortgage(uint256 _amount) public {
        mortgageCount++;
        mortgages[mortgageCount] = MortgageInfo(msg.sender, _amount, 0, false);
        emit MortgageCreated(mortgageCount, msg.sender, _amount);
    }

    function approveMortgage(uint256 _id) public onlyBank {
        require(!mortgages[_id].approved, "Already approved");
        mortgages[_id].approved = true;
        emit MortgageApproved(_id);
    }

    function makePayment(uint256 _id, uint256 _amount) public {
        MortgageInfo storage m = mortgages[_id];
        require(m.borrower == msg.sender, "Only borrower can pay");
        require(m.approved, "Mortgage not approved");
        require(m.paidAmount + _amount <= m.amount, "Exceeds amount");

        m.paidAmount += _amount;
        emit MortgagePaid(_id, _amount);
    }

    function getMortgage(uint256 _id)
        public
        view
        returns (address, uint256, uint256, bool)
    {
        MortgageInfo memory m = mortgages[_id];
        return (m.borrower, m.amount, m.paidAmount, m.approved);
    }
}
