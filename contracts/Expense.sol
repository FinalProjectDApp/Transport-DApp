pragma solidity >=0.4.0 <0.6.0;

contract Expense {

    struct transaction {
        uint id;
        string category;
        string description;
        string bill;
        uint total;
        string status;
        address user;
    }

    uint256 public constant maxTransactions = 1000;
    // Owner => files
    mapping(address => transaction[maxTransactions]) public arrTransactions;
    // Owner => last files id
    mapping(address => uint256) public lastIds;
    transaction[] public transactions;
    uint256 public totalTransactions;
    address public owner;

    // Store accounts that have voted
    mapping(address => uint) public userAddress;

    constructor() public {
        totalTransactions = 1;
        transaction memory newTransaction = transaction(1, "test", "diskeripsi",  "", 10000, "OK", msg.sender);
        transactions.push(newTransaction);
        owner = msg.sender;
    }

    event transactionEvent(string _category, string _description, string  _bill, uint _total);

    // voted event
    event votedEvent (
        uint indexed _transactionId
    );

    function getTransactionsLength() public returns (uint) {
        return transactions.length;
    }

    function getTransactionAt(uint i) public 
    returns (uint id, string memory category, string memory description, string memory bill, uint total, address user) {
        return (transactions[i].id, transactions[i].category, transactions[i].description, 
        transactions[i].bill, transactions[i].total, transactions[i].user );
    }

    function addTransaction (string memory _category, string memory _description, string memory _bill, uint _total, string memory _status) 
    public {
        totalTransactions ++;
        owner = msg.sender;
        transaction memory newTransaction = transaction(totalTransactions,_category, _description,  _bill, _total, _status, owner);
        transactions.push(newTransaction);
        // emit event
        emit votedEvent(_total);
    }

}
