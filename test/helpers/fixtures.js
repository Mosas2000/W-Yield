const { ethers } = require("hardhat");

async function vaultFixture() {
    const [owner, user1, user2, user3] = await ethers.getSigners();
    
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();
    
    const WealthVault = await ethers.getContractFactory("WealthVault");
    const vault = await WealthVault.deploy(await usdc.getAddress());
    await vault.waitForDeployment();
    
    return { vault, usdc, owner, user1, user2, user3 };
}

async function vaultWithDepositsFixture() {
    const { vault, usdc, owner, user1, user2, user3 } = await vaultFixture();
    
    const amount = ethers.parseUnits("100", 6);
    await usdc.mint(user1.address, amount);
    await usdc.connect(user1).approve(await vault.getAddress(), amount);
    await vault.connect(user1).deposit(amount);
    
    return { vault, usdc, owner, user1, user2, user3 };
}

module.exports = {
    vaultFixture,
    vaultWithDepositsFixture
};
