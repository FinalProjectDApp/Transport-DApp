pragma solidity >=0.4.0 <0.6.0;

contract Expense {

    struct transaction {
        uint id;
        string category;
        string description;
        string bill;
        int256 total;
        string status;
        string email;
        string createdAt;
    }

    struct location {
        string location;
    }

    uint256 public constant maxTransactions = 1000;
    // Owner => files
    mapping(address => transaction[maxTransactions]) public arrTransactions;
    // Owner => last files id
    mapping(address => uint256) public lastIds;
    transaction[] public transactions;
    location[] public locations;
    uint256 public totalTransactions;
    address public owner;

    // Store accounts that have voted
    mapping(address => uint) public userAddress;

    constructor() public {
        totalTransactions = 0;
    }

    event transactionEvent(string _category, string _description, string  _bill, uint _total);

    // voted event
    event votedEvent (
        int256 indexed _total
    );

    // function getTransactionsLength() public returns (uint) {
    //     return transactions.length;
    // }

    // function getTransactionAt(uint i) public 
    // returns (uint id, string memory category, string memory description, string memory bill, int256 total, string memory location) {
    //     return (transactions[i].id, transactions[i].category, transactions[i].description, 
    //     transactions[i].bill, transactions[i].total, transactions[i].location );
    // }

    function addTransaction (
        string memory _category, 
        string memory _description, 
        string memory _bill, 
        int256 _total, 
        string memory _status, 
        string memory _email, 
        string memory _createdAt,
        uint _id,
        string memory _location
    ) public {
        totalTransactions ++;
        owner = msg.sender;
        transaction memory newTransaction = transaction(_id,_category, _description,  _bill, _total, _status, _email, _createdAt);
        location memory newLocation = location(_location);
        locations.push(newLocation);
        transactions.push(newTransaction);
        // emit event
        emit votedEvent(_total);
    }

}
