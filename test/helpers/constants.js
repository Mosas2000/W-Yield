const { ethers } = require("hardhat");

module.exports = {
    USDC_DECIMALS: 6,
    WUSDC_DECIMALS: 18,
    MIN_DEPOSIT: ethers.utils.parseUnits("1", 6),
    MAX_DEPOSIT: ethers.utils.parseUnits("1000000", 6),
    DEFAULT_FEE: 200,
    MAX_FEE: 1000,
    ZERO_ADDRESS: ethers.constants.AddressZero
};
