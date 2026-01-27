const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WealthVaultV2 - Pausable", function () {
    let vault, usdc, owner, user1;
    
    beforeEach(async function () {
        [owner, user1] = await ethers.getSigners();
        
        const MockUSDC = await ethers.getContractFactory("MockUSDC");
        usdc = await MockUSDC.deploy();
        await usdc.waitForDeployment();
        
        const WealthVaultV2 = await ethers.getContractFactory("WealthVaultV2");
        vault = await WealthVaultV2.deploy(await usdc.getAddress());
        await vault.waitForDeployment();
    });
    
    it("Should pause deposits", async function () {
        await vault.pause();
        
        const amount = ethers.parseUnits("100", 6);
        await usdc.mint(user1.address, amount);
        await usdc.connect(user1).approve(await vault.getAddress(), amount);
        
        await expect(
            vault.connect(user1).deposit(amount)
        ).to.be.revertedWithCustomError(vault, "EnforcedPause");
    });
    
    it("Should allow withdrawals when paused", async function () {
        const amount = ethers.parseUnits("100", 6);
        await usdc.mint(user1.address, amount);
        await usdc.connect(user1).approve(await vault.getAddress(), amount);
        await vault.connect(user1).deposit(amount);
        
        await vault.pause();
        
        const shares = await vault.balanceOf(user1.address);
        await vault.connect(user1).withdraw(shares);
        
        expect(await vault.balanceOf(user1.address)).to.equal(0);
    });
    
    it("Should unpause", async function () {
        await vault.pause();
        await vault.unpause();
        
        const amount = ethers.parseUnits("100", 6);
        await usdc.mint(user1.address, amount);
        await usdc.connect(user1).approve(await vault.getAddress(), amount);
        await vault.connect(user1).deposit(amount);
        
        expect(await vault.balanceOf(user1.address)).to.equal(amount);
    });
});
