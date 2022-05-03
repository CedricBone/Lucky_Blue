//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./BlueCoin.sol";

contract LuckyBlue {

    //IERC20 public token; 
    //event Bought(uint256 amount);
    //event Sold(uint256 amount);

    receive() external payable {}

    fallback() external payable {}

    uint256 public ContractValue;
    address public cedric;
    address public jack;
    address[] public players;
    Vendor[] public vendors;
    uint256 numGames = 0;
    uint256 vendorFee = 2;
    uint256 playerFee = 2;
    uint256 addGameFee = 1;
    address public BlueCoin_address;

    struct Vendor {
        address payable vendorAddress;
        uint256 numVendorGames;
    }

    constructor() payable {
        cedric = 0x37813e4e4C751F902763FF5A00337Bb715a79A79;
        jack = 0xf667Eb467304D505B9fD484Aa622B9213c1B8920;
        ContractValue = msg.value;
        BlueCoin_address = 0x8eB8431eaA2dd9c4B804A176b6Ac0eEE37cD9e12;
        BlueCoin b = BlueCoin(BlueCoin_address);
        //token = new BlueCoin(100000);
        b.totalSupply();
        
    }

    


    // function buy() payable public {
    //     uint256 amountTobuy = msg.value;
    //     uint256 dexBalance = token.balanceOf(address(this));
    //     require(amountTobuy > 0, "You need to send some ether");
    //     require(amountTobuy <= dexBalance, "Not enough tokens in the reserve");
    //     token.transfer(msg.sender, amountTobuy);
    //     emit Bought(amountTobuy);
    // }

    // function sell(uint256 amount) public {
    //     require(amount > 0, "You need to sell at least some tokens");
    //     uint256 allowance = token.allowance(msg.sender, address(this));
    //     require(allowance >= amount, "Check the token allowance");
    //     token.transferFrom(msg.sender, address(this), amount);
    //     payable(msg.sender).transfer(amount);
    //     emit Sold(amount);
    // }


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

        uint256 ownerCut = msg.value / 2;
        payable(jack).transfer(ownerCut);
        payable(cedric).transfer(ownerCut);
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
        uint256 vendorCut = msg.value / 2;
        ContractValue = address(this).balance + (msg.value / 2);
        PayVendors(uint256(vendorCut)); //sends cut to vendors
        //token.transfer(jack, (msg.value/2));
        //BlueCoin b = BlueCoin(0xf667Eb467304D505B9fD484Aa622B9213c1B8920);
       // b.approve(delegate, numTokens);
       
       // token.approve(jack, 1000);
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
        require(msg.value >= vendorFee, "Not enough Blue Coin!");
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
        uint256 vendorPayment = vendorCut / vendors.length;
        for (uint256 i = 0; i < vendors.length; i++) {
            vendors[i].vendorAddress.transfer((vendorPayment));
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


    // function exchange_eth(address payable_adr, uint256 amt) public payable{
    //     payable(payable_adr).transfer(amt);
    // }

    
}
