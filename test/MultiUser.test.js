const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Multi-User Tests", function () {
    let vault, usdc, users;
    
    beforeEach(async function () {
        users = await ethers.getSigners();
        const MockUSDC = await ethers.getContractFactory("MockUSDC");
        usdc = await MockUSDC.deploy();
        const WealthVault = await ethers.getContractFactory("WealthVault");
        vault = await WealthVault.deploy(usdc.target);
    });
    
    it("3 users deposit different amounts", async function () {
        const amounts = [100, 250, 50].map(n => ethers.parseUnits(n.toString(), 6));
        
        for(let i = 0; i < 3; i++) {
            await usdc.mint(users[i].address, amounts[i]);
            await usdc.connect(users[i]).approve(vault.target, amounts[i]);
            await vault.connect(users[i]).deposit(amounts[i]);
        }
        
        expect(await vault.totalAssets()).to.equal(
            ethers.parseUnits("400", 6)
        );
    });
    
    it("Share ratio stays correct", async function () {
        const amt = ethers.parseUnits("100", 6);
        
        await usdc.mint(users[1].address, amt);
        await usdc.connect(users[1]).approve(vault.target, amt);
        await vault.connect(users[1]).deposit(amt);
        
        await usdc.mint(users[2].address, amt);
        await usdc.connect(users[2]).approve(vault.target, amt);
        await vault.connect(users[2]).deposit(amt);
        
        expect(await vault.balanceOf(users[1].address)).to.equal(
            await vault.balanceOf(users[2].address)
        );
    });
});
