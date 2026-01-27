const { ethers } = require("hardhat");

async function deployVault() {
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();
    
    const WealthVault = await ethers.getContractFactory("WealthVault");
    const vault = await WealthVault.deploy(await usdc.getAddress());
    await vault.waitForDeployment();
    
    return { vault, usdc };
}

async function setupUser(usdc, vault, user, amount) {
    await usdc.mint(user.address, amount);
    await usdc.connect(user).approve(await vault.getAddress(), amount);
}

async function deposit(vault, user, amount) {
    return await vault.connect(user).deposit(amount);
}

async function withdraw(vault, user, shares) {
    return await vault.connect(user).withdraw(shares);
}

module.exports = {
    deployVault,
    setupUser,
    deposit,
    withdraw
};
