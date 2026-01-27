const hre = require("hardhat");

async function main() {
    const newOwner = process.argv[2];
    if(!newOwner) {
        console.error("Usage: node transfer-ownership.js <new_owner>");
        process.exit(1);
    }
    
    const vault = await hre.ethers.getContractAt("WealthVault", "0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2");
    
    console.log(`Current owner: ${await vault.owner()}`);
    console.log(`Transferring to: ${newOwner}`);
    console.log("⚠️  This cannot be undone!");
    
    // Wait 5 seconds
    await new Promise(r => setTimeout(r, 5000));
    
    const tx = await vault.transferOwnership(newOwner);
    await tx.wait();
    
    console.log(`✅ Ownership transferred. Tx: ${tx.hash}`);
}

main();
