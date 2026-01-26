const hre = require("hardhat");

async function main() {
    const vault = await hre.ethers.getContractAt("WealthVault", "0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2");
    
    const depositFilter = vault.filters.Deposit();
    const deposits = await vault.queryFilter(depositFilter);
    
    const users = new Set();
    let totalDeposited = hre.ethers.BigNumber.from(0);
    
    deposits.forEach(d => {
        users.add(d.args.user);
        totalDeposited = totalDeposited.add(d.args.usdcAmount);
    });
    
    console.log(JSON.stringify({
        unique_users: users.size,
        total_deposited_usdc: hre.ethers.utils.formatUnits(totalDeposited, 6),
        total_deposits: deposits.length,
        timestamp: Date.now()
    }));
}

main();
