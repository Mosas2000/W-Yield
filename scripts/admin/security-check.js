const hre = require("hardhat");

async function main() {
    const vault = await hre.ethers.getContractAt("WealthVault", "0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2");
    
    const owner = await vault.owner();
    const fee = await vault.performanceFee();
    const recipient = await vault.feeRecipient();
    const usdc = await vault.usdc();
    
    console.log("Security Check:");
    console.log("Owner:", owner);
    console.log("Fee:", fee.toNumber() / 100, "%");
    console.log("Fee Recipient:", recipient);
    console.log("USDC:", usdc);
    
    // Check for issues
    if(fee.gt(1000)) console.warn("⚠️  Fee above 10%");
    if(owner === hre.ethers.constants.AddressZero) console.error("❌ No owner");
    if(recipient === hre.ethers.constants.AddressZero) console.error("❌ No fee recipient");
    
    console.log("✅ Check complete");
}

main();
