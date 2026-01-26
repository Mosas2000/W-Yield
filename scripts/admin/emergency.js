const hre = require("hardhat");

async function main() {
    const vault = await hre.ethers.getContractAt("WealthVault", "0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2");
    
    console.log("Setting fee to 0...");
    await vault.setPerformanceFee(0);
    
    console.log("Done");
}

main();
