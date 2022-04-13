//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Payment {
    address public owner;
    struct PaymentType {
        address customer;
        uint256 tier;
    }

    constructor() {
        owner = msg.sender;
    }

    mapping(address => PaymentType[]) private clients;

    function addClient(
        address dev,
        address client,
        uint256 tier
    ) public {
        PaymentType memory p = PaymentType(client, tier);

        clients[dev].push(p);
    }

    function getAllClients(address dev) public view returns (address[] memory) {
        address[] memory myClients = new address[](clients[dev].length);
        for (uint256 i = 0; i < clients[dev].length; i++) {
            address client = clients[dev][i].customer;
            myClients[i] = client;
        }
        return myClients;
    }

    function pay(address payable dev) public payable {
        if (msg.value > 0) {
            dev.transfer(msg.value);
        }
    }
}
