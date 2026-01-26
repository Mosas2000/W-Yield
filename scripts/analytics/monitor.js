const hre = require("hardhat");

async function main() {
    const vault = await hre.ethers.getContractAt("WealthVault", "0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2");
    
    console.log("Monitoring vault events...");
    
    vault.on("Deposit", (user, amount, shares) => {
        console.log(`DEPOSIT: ${user} - ${hre.ethers.utils.formatUnits(amount, 6)} USDC`);
    });
    
    vault.on("Withdraw", (user, shares, amount) => {
        console.log(`WITHDRAW: ${user} - ${hre.ethers.utils.formatUnits(amount, 6)} USDC`);
    });
    
    vault.on("FeeUpdated", (newFee) => {
        console.log(`FEE UPDATED: ${newFee.toNumber() / 100}%`);
    });
}

main();
