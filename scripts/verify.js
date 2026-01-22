const hre = require("hardhat");

async function main() {
    const fs = require('fs');
    const network = hre.network.name;
    
    console.log(`🔍 Verifying on ${network}...\n`);
    
    const deployment = JSON.parse(
        fs.readFileSync(`deployment-${network}.json`)
    );
    
    await hre.run("verify:verify", {
        address: deployment.contract,
        constructorArguments: [deployment.usdc]
    });
    
    console.log("✅ Verified!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
