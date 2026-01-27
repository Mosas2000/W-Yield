const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const vault = await hre.ethers.getContractAt("WealthVault", "0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2");
    
    const owner = await vault.owner();
    const fee = await vault.performanceFee();
    const recipient = await vault.feeRecipient();
    const tvl = await vault.totalAssets();
    const supply = await vault.totalSupply();
    
    const deposits = await vault.queryFilter(vault.filters.Deposit());
    const withdraws = await vault.queryFilter(vault.filters.Withdraw());
    
    const report = {
        generated: new Date().toISOString(),
        contract: vault.address,
        owner: owner,
        config: {
            fee_bps: fee.toNumber(),
            fee_recipient: recipient
        },
        state: {
            tvl_usdc: hre.ethers.utils.formatUnits(tvl, 6),
            total_supply: hre.ethers.utils.formatUnits(supply, 18)
        },
        activity: {
            total_deposits: deposits.length,
            total_withdrawals: withdraws.length,
            unique_users: new Set([...deposits.map(d => d.args.user), ...withdraws.map(w => w.args.user)]).size
        }
    };
    
    const filename = `audit-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`Report saved: ${filename}`);
}

main();
