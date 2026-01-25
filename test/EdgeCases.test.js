const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Edge Cases", function () {
    let vault, usdc, user;
    
    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();
        const MockUSDC = await ethers.getContractFactory("MockUSDC");
        usdc = await MockUSDC.deploy();
        const WealthVault = await ethers.getContractFactory("WealthVault");
        vault = await WealthVault.deploy(usdc.target);
    });
    
    it("Minimum deposit (1 USDC)", async function () {
        const min = ethers.parseUnits("1", 6);
        await usdc.mint(user.address, min);
        await usdc.connect(user).approve(vault.target, min);
        await vault.connect(user).deposit(min);
        expect(await vault.balanceOf(user.address)).to.equal(min);
    });
    
    it("Maximum deposit (1M USDC)", async function () {
        const max = ethers.parseUnits("1000000", 6);
        await usdc.mint(user.address, max);
        await usdc.connect(user).approve(vault.target, max);
        await vault.connect(user).deposit(max);
        expect(await vault.balanceOf(user.address)).to.equal(max);
    });
    
    it("Revert on 0 deposit", async function () {
        await expect(vault.connect(user).deposit(0)).to.be.revertedWith("Below minimum");
    });
    
    it("Revert on 0 withdraw", async function () {
        await expect(vault.connect(user).withdraw(0)).to.be.revertedWith("Zero shares");
    });
});
