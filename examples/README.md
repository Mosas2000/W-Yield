# W-Yield Integration Examples

Code examples for integrating with the W-Yield vault deployed on Base Mainnet.

**Contract Address:** `0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2`

## 📦 Files

### React Components (ethers.js v5)
- **Deposit.jsx** - React component for depositing USDC
- **Withdraw.jsx** - React component for withdrawing funds

### Vanilla JavaScript
- **index.html** - Simple HTML page with deposit/withdraw functionality

### Python
- **client.py** - Python script using web3.py for programmatic access

## 🚀 Quick Start

### React Example

```bash
npm install ethers@5
```

```jsx
import Deposit from './examples/Deposit';
import Withdraw from './examples/Withdraw';

function App() {
  return (
    <div>
      <Deposit />
      <Withdraw />
    </div>
  );
}
```

### Vanilla JS Example

Simply open `index.html` in a browser with MetaMask installed:

```bash
open examples/index.html
```

### Python Example

```bash
pip install web3
```

```python
from client import get_balance, deposit

# Check balance
balance = get_balance('0xYourAddress')
print(f"wUSDC Balance: {balance / 10**18}")

# Deposit 100 USDC
deposit('your_private_key', 100)
```

## 📝 Contract ABIs

### Deposit
```solidity
function deposit(uint256 amount) external returns (uint256 shares)
```

### Withdraw
```solidity
function withdraw(uint256 shares) external returns (uint256 amount)
```

### Check Balance
```solidity
function balanceOf(address account) external view returns (uint256)
```

### Get Total Assets
```solidity
function totalAssets() public view returns (uint256)
```

## 🔗 Links

- **Contract:** https://basescan.org/address/0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2
- **USDC (Base):** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Network:** Base Mainnet (Chain ID: 8453)

## ⚠️ Important Notes

1. Always approve USDC before depositing
2. Amounts are in USDC decimals (6 decimals)
3. Vault shares (wUSDC) use 18 decimals
4. Test on Base Sepolia first if needed

## 💡 Tips

- Use `convertToShares()` to preview deposit
- Use `convertToAssets()` to preview withdrawal
- Check `MIN_DEPOSIT` (1 USDC) and `MAX_DEPOSIT` (1M USDC)

---

Built by cryptosecure.base.eth
