const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

const address1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
const address2 = "0x782D8027c193c75f3DcC62A7bAe2D4C5a7ff71A2"



describe("Transactions", function () {
  it("Should transfer tokens between accounts", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const provider = ethers.getDefaultProvider();

    const Token = await ethers.getContractFactory("Payment");

    const payment = await Token.deploy();

    await payment.addClient(addr1.address, addr2.address, 1);
    await payment.addClient(addr1.address, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 3);
    // Transfer 50 tokens from owner to addr1
    console.log(await payment.getAllClients(addr1.address));
    const balance = await ethers.provider.getBalance(addr1.address);
    await payment.pay(addr2.address, { value: balance, from: addr1.address });
    await payment.pay(addr1.address, { value: ethers.utils.parseEther("1") });

    expect(await ethers.provider.getBalance(addr1.address)).to.equal(ethers.utils.parseEther("1"));
  });
});
