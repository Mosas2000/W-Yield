const hre = require("hardhat");

async function main() {
    const vault = await hre.ethers.getContractAt("WealthVault", "0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2");
    
    const totalAssets = await vault.totalAssets();
    const totalSupply = await vault.totalSupply();
    const fee = await vault.performanceFee();
    
    console.log("Total Assets:", hre.ethers.formatUnits(totalAssets, 6), "USDC");
    console.log("Total Supply:", hre.ethers.formatUnits(totalSupply, 18), "wUSDC");
    console.log("Performance Fee:", Number(fee) / 100, "%");
}

main();
