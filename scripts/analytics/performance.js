const hre = require("hardhat");

async function main() {
    const vault = await hre.ethers.getContractAt("WealthVault", "0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2");
    
    const deposits = await vault.queryFilter(vault.filters.Deposit());
    const withdraws = await vault.queryFilter(vault.filters.Withdraw());
    
    let totalIn = hre.ethers.BigNumber.from(0);
    let totalOut = hre.ethers.BigNumber.from(0);
    
    deposits.forEach(d => totalIn = totalIn.add(d.args.usdcAmount));
    withdraws.forEach(w => totalOut = totalOut.add(w.args.usdcAmount));
    
    const current = await vault.totalAssets();
    const netFlow = totalIn.sub(totalOut);
    const profit = current.sub(netFlow);
    
    console.log(JSON.stringify({
        total_deposited: hre.ethers.utils.formatUnits(totalIn, 6),
        total_withdrawn: hre.ethers.utils.formatUnits(totalOut, 6),
        current_tvl: hre.ethers.utils.formatUnits(current, 6),
        profit: hre.ethers.utils.formatUnits(profit, 6),
        timestamp: Date.now()
    }));
}

main();
