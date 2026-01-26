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
- **Mainnet:** [`0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2`](https://basescan.org/address/0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2#code)

## 📚 Integration Examples

Check out [examples/](examples/) for code samples:
- React components (Deposit/Withdraw)
- Vanilla JavaScript
- Python client

## 📖 Documentation

- **[API Reference](docs/API.md)** - Complete function documentation
- **[Integration Guide](docs/INTEGRATION.md)** - Quick start guide
- **[Security](SECURITY.md)** - Security practices and audits
- **[Contributing](CONTRIBUTING.md)** - Development guidelines

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
