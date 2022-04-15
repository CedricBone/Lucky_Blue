//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract LuckyBule {
    receive() external payable {}

    fallback() external payable {}

    uint256 public ContractValue;
    address public cedric;
    address public jack;
    address[] public players;
    Vendor[] public vendors;
    uint256 numGames = 0;
    uint256 vendorFee = 1;
    uint256 playerFee = 10;
    uint256 addGameFee = 5;

    struct Vendor {
        address payable vendorAddress;
        uint256 numVendorGames;
    }

    constructor() payable {
        cedric = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
        jack = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;
        ContractValue = msg.value;
    }

    function getBalance() public view returns (uint256) {
        return (address(this).balance / (1 ether));
    }

    function extractValue() public payable {
        require(
            msg.value <= ContractValue,
            "Requested value is more than contract's balance"
        );
        require(
            payable(msg.sender) == jack || payable(msg.sender) == cedric,
            "You are not an owner"
        );
        //payable(cedric).transfer(msg.value);
        bool sent = payable(msg.sender).send(msg.value);
        require(sent, "Failed to send Ether");
        ContractValue = address(this).balance - (msg.value);
    }

    // Registers a player
    function RegisterPlayer() public payable {
        require(msg.value >= playerFee, "Not enough Blue Coin!"); //pay fee
        require(
            CheckPlayer(payable(msg.sender)) == false,
            "You are already a player"
        );
        players.push(payable(msg.sender)); //added to list
        //require(numGames > 0, "No Games");
        uint256 vendorCut = msg.value / 2;
        ContractValue = address(this).balance + (msg.value / 2);
        PayVendors(uint256(vendorCut)); //sends cut to vendors
    }

    // Deregisters a player
    function DeregisterPlayer() public {
        require(
            CheckPlayer(payable(msg.sender)) == true,
            "You are not a player"
        );
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == msg.sender) {
                players[i] = players[players.length - 1];
                players.pop();
                return;
            }
        }
    }

    // Registers a Vendor
    function RegisterVendor() public payable {
        require(msg.value >= vendorFee, "Not enough Blue Coin!"); //takes inital game and payment
        require(
            CheckVendor(payable(msg.sender)) == false,
            "You are already a vendor"
        );
        vendors.push(
            Vendor({vendorAddress: payable(msg.sender), numVendorGames: 0})
        ); //added to list
        ContractValue = address(this).balance + msg.value;
    }

    // Deregisters a Vendor
    function DeregisterVendor() public {
        require(
            CheckVendor(payable(msg.sender)) == true,
            "You are not a vendor"
        );
        for (uint256 i = 0; i < vendors.length; i++) {
            if (vendors[i].vendorAddress == msg.sender) {
                vendors[i] = vendors[vendors.length - 1];
                vendors.pop();
                return;
            }
        }
    }

    // Checks if a player is registered
    function CheckPlayer(address payable player) public view returns (bool) {
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == player) return true;
        }
        return false;
    }

    // Checks if a vendor is registered
    function CheckVendor(address payable vendor) public view returns (bool) {
        for (uint256 i = 0; i < vendors.length; i++) {
            if (vendors[i].vendorAddress == vendor) return true;
        }
        return false;
    }

    //pays vendors thier cut
    function PayVendors(uint256 vendorCut) public payable {
        uint256 payPerGame = vendorCut / numGames;
        for (uint256 i = 0; i < vendors.length; i++) {
            vendors[i].vendorAddress.transfer(
                (payPerGame * vendors[i].numVendorGames)
            );
        }
        ContractValue = address(this).balance - vendorCut;
    }

    //adds a game to from a vendor
    function AddGame() public payable {
        require(msg.value >= addGameFee, "Not enough Blue Coin!");
        require(
            CheckVendor(payable(msg.sender)) == true,
            "Not a registered vendor"
        );
        numGames = numGames + 1;
        for (uint256 i = 0; i < vendors.length; i++) {
            if (vendors[i].vendorAddress == msg.sender) {
                vendors[i].numVendorGames = vendors[i].numVendorGames + 1;
            }
        }
        ContractValue = address(this).balance + msg.value;
    }
}
