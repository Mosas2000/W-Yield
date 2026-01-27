const { ethers } = require("hardhat");

module.exports = {
    USDC_DECIMALS: 6,
    WUSDC_DECIMALS: 18,
    MIN_DEPOSIT: ethers.parseUnits("1", 6),
    MAX_DEPOSIT: ethers.parseUnits("1000000", 6),
    DEFAULT_FEE: 200,
    MAX_FEE: 1000,
    ZERO_ADDRESS: ethers.ZeroAddress
};
