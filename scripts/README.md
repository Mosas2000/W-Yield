# W-Yield Utility Scripts

Useful scripts for managing and monitoring the W-Yield vault on Base Mainnet.

## 📊 User Scripts

### Check Balance
View your wUSDC shares and equivalent USDC value:

```bash
npm run balance
```

**Output:**
```
wUSDC: 100.0
USDC: 100.523
```

### Vault Statistics
Display overall vault metrics:

```bash
npm run stats
```

**Output:**
```
Total Assets: 1000.0 USDC
Total Supply: 995.3 wUSDC
Performance Fee: 2 %
```

## 🔧 Admin Scripts

### Emergency Fee Adjustment
**⚠️ Admin only** - Set performance fee to 0% in emergency:

```bash
npm run emergency
```

**Note:** Only the contract owner can execute this script.

## 🛠️ Manual Usage

You can also run scripts directly with Hardhat:

```bash
# Check balance on mainnet
npx hardhat run scripts/utils/check-balance.js --network base

# Get stats on testnet
npx hardhat run scripts/utils/vault-stats.js --network baseSepolia
```

## 📝 Script Descriptions

### utils/check-balance.js
- Reads your wallet's wUSDC balance
- Converts to equivalent USDC value
- Uses `convertToAssets()` for accurate conversion

### utils/vault-stats.js
- Queries total USDC in vault
- Shows total wUSDC supply
- Displays current performance fee

### admin/emergency.js
- Sets performance fee to 0%
- Only executable by contract owner
- Use in emergency situations

## 🔗 Contract Address

**WealthVault:** `0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2`

All scripts automatically connect to this deployed contract.

## ⚙️ Configuration

Scripts use your Hardhat configuration from `.env`:
- `PRIVATE_KEY` - Your wallet private key
- Network RPC URLs from `hardhat.config.js`

## 💡 Tips

- Run `npm run balance` after deposits/withdrawals to verify
- Use `npm run stats` to monitor vault health
- Always test on Base Sepolia first if creating new scripts

---

Built by cryptosecure.base.eth
