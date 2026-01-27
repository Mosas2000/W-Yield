const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { vaultFixture } = require("./helpers/fixtures");

describe("Integration Tests", function () {
    it("Complete user flow", async function () {
        const { vault, usdc, user1 } = await loadFixture(vaultFixture);
        
        // Mint USDC
        const amount = ethers.parseUnits("100", 6);
        await usdc.mint(user1.address, amount);
        
        // Approve
        await usdc.connect(user1).approve(await vault.getAddress(), amount);
        
        // Deposit
        await vault.connect(user1).deposit(amount);
        expect(await vault.balanceOf(user1.address)).to.equal(amount);
        
        // Check balance
        const shares = await vault.balanceOf(user1.address);
        const value = await vault.convertToAssets(shares);
        expect(value).to.equal(amount);
        
        // Withdraw
        await vault.connect(user1).withdraw(shares);
        expect(await vault.balanceOf(user1.address)).to.equal(0);
        expect(await usdc.balanceOf(user1.address)).to.equal(amount);
    });
    
    it("Multiple users interact", async function () {
        const { vault, usdc, user1, user2, user3 } = await loadFixture(vaultFixture);
        
        const amounts = [100, 200, 50].map(n => ethers.parseUnits(n.toString(), 6));
        const users = [user1, user2, user3];
        
        const vaultAddress = await vault.getAddress();
        
        // All deposit
        for(let i = 0; i < 3; i++) {
            await usdc.mint(users[i].address, amounts[i]);
            await usdc.connect(users[i]).approve(vaultAddress, amounts[i]);
            await vault.connect(users[i]).deposit(amounts[i]);
        }
        
        // Check TVL
        const tvl = await vault.totalAssets();
        expect(tvl).to.equal(ethers.parseUnits("350", 6));
        
        // User 1 withdraws
        const shares = await vault.balanceOf(user1.address);
        await vault.connect(user1).withdraw(shares);
        
        // Check TVL decreased
        const newTvl = await vault.totalAssets();
        expect(newTvl).to.equal(ethers.parseUnits("250", 6));
    });
});
