const hre = require("hardhat");

async function main() {
    const vault = await hre.ethers.getContractAt("WealthVault", "0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2");
    const [signer] = await hre.ethers.getSigners();
    
    const shares = await vault.balanceOf(signer.address);
    const assets = await vault.convertToAssets(shares);
    
    console.log("wUSDC:", hre.ethers.formatUnits(shares, 18));
    console.log("USDC:", hre.ethers.formatUnits(assets, 6));
}

main();
