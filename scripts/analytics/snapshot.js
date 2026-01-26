const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const vault = await hre.ethers.getContractAt("WealthVault", "0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2");
    
    const totalAssets = await vault.totalAssets();
    const totalSupply = await vault.totalSupply();
    const fee = await vault.performanceFee();
    
    const depositFilter = vault.filters.Deposit();
    const deposits = await vault.queryFilter(depositFilter);
    const users = new Set(deposits.map(d => d.args.user));
    
    const snapshot = {
        date: new Date().toISOString().split('T')[0],
        tvl: hre.ethers.utils.formatUnits(totalAssets, 6),
        supply: hre.ethers.utils.formatUnits(totalSupply, 18),
        fee_bps: fee.toNumber(),
        unique_users: users.size,
        total_deposits: deposits.length
    };
    
    const filename = `snapshots/${snapshot.date}.json`;
    if (!fs.existsSync('snapshots')) fs.mkdirSync('snapshots');
    fs.writeFileSync(filename, JSON.stringify(snapshot, null, 2));
    
    console.log(`Snapshot saved: ${filename}`);
}

main();
