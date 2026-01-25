const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Gas Optimization", function () {
    let vault, usdc, user;
    
    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();
        const MockUSDC = await ethers.getContractFactory("MockUSDC");
        usdc = await MockUSDC.deploy();
        const WealthVault = await ethers.getContractFactory("WealthVault");
        vault = await WealthVault.deploy(usdc.target);
    });
    
    it("Measure deposit gas", async function () {
        const amt = ethers.parseUnits("100", 6);
        await usdc.mint(user.address, amt);
        await usdc.connect(user).approve(vault.target, amt);
        
        const tx = await vault.connect(user).deposit(amt);
        const receipt = await tx.wait();
        console.log("Deposit gas:", receipt.gasUsed.toString());
        expect(receipt.gasUsed).to.be.lt(150000);
    });
    
    it("Measure withdraw gas", async function () {
        const amt = ethers.parseUnits("100", 6);
        await usdc.mint(user.address, amt);
        await usdc.connect(user).approve(vault.target, amt);
        await vault.connect(user).deposit(amt);
        
        const shares = await vault.balanceOf(user.address);
        const tx = await vault.connect(user).withdraw(shares);
        const receipt = await tx.wait();
        console.log("Withdraw gas:", receipt.gasUsed.toString());
        expect(receipt.gasUsed).to.be.lt(100000);
    });
});
