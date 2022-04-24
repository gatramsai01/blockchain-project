// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

contract Timestamping {

    string fileHash;
    uint state1=0;
    uint state2=0;
    address owner; // contract owner
     // each customer can have a stamp pending order
    mapping (string => order) orders;
    mapping (address => uint) stampers;
    address[] stampersList;
    mapping (address => uint) balance;
    
    uint lastRequest = 0; // records the time of the last request. is used to prevent providers from unlinking before the stamp is finalized 
    uint bail = 1000000000000000000;// value of caucao em wei -> 1 Ether
    uint minimumProviders = 3; // minimum number of providers for the stamp to be valid
    uint rewardWindow = 10;// 20 seconds
    uint commitmentWindow = 16; // commitment and decommitment window
    uint minimumDeposit = 10000000000000000; // minimum stamp value in wei -> 0.01 Ether
    uint commitmentsLimit = 10;// commitment limit
    uint reimburseRequester = 10000000000000000; // refund amount in wei to the requester -> 0.001 Ether
    uint reimburseProvider = 1000000000000000;// refund amount in wei for participating providers -> 0.0001 Ether
    
   /* Debug variables */
    bytes32 byt;
    address addr;
    uint uin;

    constructor()  {
        owner = msg.sender;
    }

    struct order {
        address[] stampers;
        bytes32[] commitments;
        uint[] times; // need in seconds
        address requester;
        uint t1;
        uint t2;
        uint t3;
        uint deposit;
        uint timestamp;
        uint status; // 0 - not finished, 1 - successfully finished, 2 - unsuccessfully finished
    }
    
    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }
    
    modifier commitmentsRestrictions(string memory data) {
        require(stampers[msg.sender] == 1);
        require(orders[data].commitments.length < commitmentsLimit);
        _;
    }
    
    modifier requestRestrictions() {
        require(msg.value >= minimumDeposit); 
        _;
    }

    modifier revealRetrictions(string memory data) {
        require(stampers[msg.sender] == 1);
        require(isRevealInterval(data) == 1);
        _;
    }
    
    modifier selectRestrictions(string memory data) {
        require(orders[data].requester == msg.sender);
        require(isSelectStampInterval(data) == 1);
        _;
    }
    
    modifier withdrawalRestricion() {
        require(lastRequest + 48 < block.number);
        _;
    }

    event Datasender(string _data,uint _t2,uint _t3);

/* User says he wants to stamp something */
    function requestTimestamp(string memory data) public payable requestRestrictions {
        fileHash=data;
        state1=1;
        orders[data].requester = msg.sender;
        orders[data].t1 = block.timestamp;
        orders[data].t2 = orders[data].t1 + 30;
        orders[data].t3 = orders[data].t2 + 30;
        orders[data].deposit = msg.value;
        orders[data].status = 0;
        lastRequest = block.number;
        emit Datasender(data, orders[data].t2, orders[data].t3);
    }

/* Provider registers for the service */
    function joinStamper() public payable {
        bool flag = true;
        for (uint i = 0; i < stampersList.length; i++) {
            if (stampersList[i] == msg.sender) {
                flag = false;
                break;
            }
        }
        if (flag) {
            stampersList.push(msg.sender);
        }
        balance[msg.sender] += msg.value;
        if (balance[msg.sender] >= bail) {
            stampers[msg.sender] = 1;
        }
    }
/* Provider sends commitment to 'data' before time T2 */
    function sendCommitment(string memory data, bytes32 commitment) public commitmentsRestrictions(data) {
        orders[data].stampers.push(msg.sender);
        orders[data].commitments.push(commitment);
    }
    
/* Provider releases commitment for 'data' between time T2 and T3 */
    function revealCommitment(string memory data, uint time, uint nonce) public revealRetrictions(data) {
        for (uint i = 0; i < orders[data].stampers.length; i++) {
            if (orders[data].stampers[i] == msg.sender){
                if (keccak256(abi.encodePacked(data,time,nonce)) == orders[data].commitments[i]) {
                    orders[data].commitments[i] = bytes32(time);
                    orders[data].times.push(time);
                    state2=1;
                } 
                break;
                 
                
            }
        }
    }


  
/* User requests stamp after time T3 */
    function selectStampRequester(string memory data) public{

        uint t=0;
            for(uint i=0; i<orders[data].times.length; i++)
            {
                t=t+orders[data].times[i];
            }
            orders[data].timestamp=uint(t/orders[data].times.length);
            reimburse(data);
            orders[data].status = 1;
            delete orders[data].stampers;
            delete orders[data].commitments;
            delete orders[data].times;
            delete orders[data].t1;
            delete orders[data].t2;
            delete orders[data].t3;
            delete orders[data].deposit;
            delete fileHash;
            state1=0;
    }
    
    
   
/* Query functions after stamp completion */
    function getTimestamp(string memory data) public view returns(uint) {
        return orders[data].timestamp;
    }
    
    function getRequester(string memory data) public view returns(address) {
        return orders[data].requester;
    }

 
/* Helper sort functions */
    function sortArray(string memory data) internal {
        quicksort(data, 0, int(orders[data].times.length-1));
    }
    
    function quicksort(string memory data, int low, int high) internal {
        if (low < high) {
            int split = partition(data, low, high);
        require(owner == msg.sender);
            quicksort(data, low, split-1);
            quicksort(data, split+1, high);
        }
    }
    
    function partition(string memory data, int low, int high) internal returns(int) {
        int i = low - 1;
        uint troca ;
        for (int j = low; j < high; j++) {
            if (orders[data].times[uint(j)] <= orders[data].times[uint(high)]) {
                i++;
                 troca = orders[data].times[uint(i)];
                orders[data].times[uint(i)] = orders[data].times[uint(j)];
                orders[data].times[uint(j)] = troca;
            }
        }
         troca = orders[data].times[uint(i+1)];
        orders[data].times[uint(i+1)] = orders[data].times[uint(high)];
        orders[data].times[uint(high)] = troca;
        return i+1;
    }
    
   /* Auxiliary query functions */
    function isCommitmentInterval(string memory data) public view returns(uint) {
        if ((block.timestamp < orders[data].t2 || orders[data].t1 == 0) && orders[data].status == 0)
            return 1;
        return 0;
    }
    
    function isRevealInterval(string memory data) public view returns(uint) {
        if (block.timestamp >= orders[data].t2 && block.timestamp < orders[data].t3)
            return 1;
        return 0;
    }
    
    function isSelectStampInterval(string memory data) public view returns(uint) {
        if (block.timestamp >= orders[data].t3 && orders[data].t3 != 0)
            return 1;
        return 0;
    }
    
    function blockNumber() public view returns(uint) {
        return block.number;
    }
    
    function getOrderT1(string memory data) public view returns(uint) {
        return orders[data].t1;
    }
    
    function getOrderT2(string memory data) public view returns(uint) {
        return orders[data].t2;
    }
    
    function getOrderT3(string memory data) public view returns(uint) {
        return orders[data].t3;
    }
       
    
    function getOrderDeposit(string memory data) public view returns(uint) {
        return orders[data].deposit;
    }
    
    function getStatus(string memory data) public view returns(uint) {
        return orders[data].status;
    }
    
    function getStampers() public view returns(address [] memory ){
        return stampersList;
    }

    function getFilehash()public view returns(string memory) {
        return fileHash;
    }
     function getState1()public view returns(uint){
        return state1;
    }
    function getState2()public view returns(uint){
        return state2;
    }
/* Configuration area */


    function setBail(uint value) public onlyOwner {
        bail = value;
    }


    function setMinimumProviders(uint value) public onlyOwner {
        minimumProviders = value;
    }
    


    function setRewardWindow(uint value) public onlyOwner {
        rewardWindow = value;
    }
    

    function setCommitmentWindow(uint value) public onlyOwner {
        commitmentWindow = value;
    }
    


    function setMinimumDeposit(uint value) public onlyOwner {
        minimumDeposit = value;
    }



    function setCommitmentsLimit(uint value) public onlyOwner {
        commitmentsLimit = value;
    }
    
 

    function setReimburseRequester(uint value) public onlyOwner {
        reimburseRequester = value;
    }

    function setReimburseProvider(uint value) public onlyOwner {
        reimburseProvider = value;
    }

/* Financial area */

  
    function withdrawalAndContinue() public payable  withdrawalRestricion {
        if (balance[msg.sender] > bail) {
           payable(msg.sender).transfer(balance[msg.sender] - bail);
            balance[msg.sender] = bail;
        }
    }
    


    function withdrawalAll() public payable withdrawalRestricion {
       payable( msg.sender).transfer(balance[msg.sender]);
        balance[msg.sender] = 0;
        stampers[msg.sender] = 0;
    }
    

    function getBalance() public view returns(uint) {
        return balance[msg.sender];
    }
    
   
// Function to reimburse the applicant and the providers that participated
    function reimburse(string memory data) internal {
       // Number of providers that participated
        uint providers = orders[data].stampers.length;
        
       // Counts the number of active contributors
        uint collaborators = 0;
        for (uint i = 0; i < stampersList.length; i++) {
            if (stampers[stampersList[i]] == 1) {
                collaborators++;
            }
        }
        collaborators -= providers;
        
        if (collaborators > 0) {
            // Collects contributions from each employee, including participants
            uint collaborationValue = (reimburseRequester + providers * reimburseProvider)/collaborators;
            for (uint i = 0; i < stampersList.length; i++) {
                if (stampers[stampersList[i]] == 1) {
                    balance[stampersList[i]] -= collaborationValue;
                }
            }
            
            
// Refund participants
            for (uint i = 0; i < orders[data].stampers.length; i++) {
                balance[orders[data].stampers[i]] += (collaborationValue + reimburseProvider);
            }
            
            
// Reimburse the applicant the value of the stamp + collaboration
            balance[orders[data].requester] += (orders[data].deposit + reimburseRequester);
        } else {
           
// Refunds the applicant the stamp value
            balance[orders[data].requester] += orders[data].deposit;
        }
    }
    
    
// Function to distribute reward
    function reward(string memory data, uint first, uint last) internal {
       
        uint rewardValue = orders[data].deposit/(last - first + 1);
        for (uint i = first; i <= last; i++) {
            for (uint j = 0; j < orders[data].commitments.length; j++) {
                if (orders[data].commitments[j] == bytes32(orders[data].times[i])) {
                    balance[orders[data].stampers[j]] += rewardValue;
                }        
            }
        }
    }
    


/* Debug functions */
    
    function getOrderStampTimes(string memory data) public view returns(uint[] memory) {
        return orders[data].times;
    }

    function getByt() public view returns(bytes32) {
        return byt;
    }
    
    function getAddr() public view returns(address) {
        return addr;   
    }

    function getUin() public view returns(uint) {
        return uin;
    }

    function getBalanceThis() public view returns(uint) {
        return address(this).balance;
    }
}