const { ethers } = require("hardhat");

async function vaultFixture() {
    const [owner, user1, user2, user3] = await ethers.getSigners();
    
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    
    const WealthVault = await ethers.getContractFactory("WealthVault");
    const vault = await WealthVault.deploy(usdc.address);
    
    return { vault, usdc, owner, user1, user2, user3 };
}

async function vaultWithDepositsFixture() {
    const { vault, usdc, owner, user1, user2, user3 } = await vaultFixture();
    
    const amount = ethers.utils.parseUnits("100", 6);
    await usdc.mint(user1.address, amount);
    await usdc.connect(user1).approve(vault.address, amount);
    await vault.connect(user1).deposit(amount);
    
    return { vault, usdc, owner, user1, user2, user3 };
}

module.exports = {
    vaultFixture,
    vaultWithDepositsFixture
};
