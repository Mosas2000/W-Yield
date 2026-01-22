# W-Yield

**Simple. Secure. Yield.**

Professional yield vault on Base for wealth generation.

## Features
- 💰 Deposit USDC, earn yield
- ⚡ Withdraw anytime (no lock)
- 💎 Low fees (2% performance fee)
- 🔗 Fully on-chain

## Contract
- **WealthVault.sol** - Main vault contract
- **Token:** wUSDC (W-Yield USDC shares)

## Deployment

### Prerequisites
- Base Sepolia ETH (from faucet)
- Basescan API key

### Deploy to Testnet
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
npx hardhat run scripts/verify.js --network baseSepolia
```

### Deploy to Mainnet
```bash
npx hardhat run scripts/deploy.js --network base
npx hardhat run scripts/verify.js --network base
```

## Status
🚧 In Development

## Author
cryptosecure.base.eth
