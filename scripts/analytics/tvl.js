const hre = require("hardhat");

async function main() {
    const vault = await hre.ethers.getContractAt("WealthVault", "0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2");
    
    const totalAssets = await vault.totalAssets();
    const totalSupply = await vault.totalSupply();
    
    const tvl = hre.ethers.utils.formatUnits(totalAssets, 6);
    const supply = hre.ethers.utils.formatUnits(totalSupply, 18);
    const ratio = totalAssets.gt(0) ? totalSupply.mul(1000000).div(totalAssets).toNumber() / 1000000 : 1;
    
    console.log(JSON.stringify({
        tvl_usdc: tvl,
        total_supply_wusdc: supply,
        share_ratio: ratio.toFixed(6),
        timestamp: Date.now()
    }));
}

main();
