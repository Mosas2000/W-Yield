const hre = require("hardhat");

async function main() {
    const newFee = process.argv[2];
    if(!newFee) {
        console.error("Usage: node update-fee.js <fee_bps>");
        process.exit(1);
    }
    
    const vault = await hre.ethers.getContractAt("WealthVault", "0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2");
    
    console.log(`Current fee: ${(await vault.performanceFee()).toNumber() / 100}%`);
    console.log(`Setting fee to: ${newFee / 100}%`);
    
    const tx = await vault.setPerformanceFee(newFee);
    await tx.wait();
    
    console.log(`✅ Fee updated. Tx: ${tx.hash}`);
}

main();
