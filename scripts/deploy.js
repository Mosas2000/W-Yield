const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying W-Yield...");
    console.log("Simple. Secure. Yield.\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer:", deployer.address);
    console.log("Basename: cryptosecure.base.eth\n");

    // USDC addresses
    const USDC = hre.network.name === "base" 
        ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" // Base Mainnet
        : "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Base Sepolia

    console.log("📦 Deploying WealthVault...");
    const WealthVault = await hre.ethers.getContractFactory("WealthVault");
    const vault = await WealthVault.deploy(USDC);
    await vault.waitForDeployment();
    
    console.log("✅ WealthVault:", await vault.getAddress());
    console.log("\n🔍 Verify with:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${await vault.getAddress()} "${USDC}"`);
    
    // Save deployment
    const fs = require('fs');
    const deployment = {
        network: hre.network.name,
        deployer: deployer.address,
        basename: "cryptosecure.base.eth",
        contract: await vault.getAddress(),
        usdc: USDC,
        timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(
        `deployment-${hre.network.name}.json`,
        JSON.stringify(deployment, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
