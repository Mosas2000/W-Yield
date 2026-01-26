# Integration Guide

**Contract Address:** `0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2`  
**Network:** Base Mainnet (Chain ID: 8453)  
**USDC:** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

## Quick Start

### Deposit Flow

1. **Approve USDC**
```solidity
IERC20(USDC).approve(VAULT_ADDRESS, amount);
```

2. **Call deposit**
```solidity
uint256 shares = WealthVault(VAULT_ADDRESS).deposit(amount);
```

### Withdraw Flow

1. **Call withdraw**
```solidity
uint256 amount = WealthVault(VAULT_ADDRESS).withdraw(shares);
```

## Examples

See the [examples/](../examples/) folder for complete integration examples:

- **Deposit.jsx** - React deposit component
- **Withdraw.jsx** - React withdraw component  
- **index.html** - Vanilla JavaScript implementation
- **client.py** - Python web3.py client

## Contract ABI

Minimal ABI for integration:

```json
[
  "function deposit(uint256) external returns (uint256)",
  "function withdraw(uint256) external returns (uint256)",
  "function balanceOf(address) external view returns (uint256)",
  "function convertToAssets(uint256) external view returns (uint256)",
  "function convertToShares(uint256) external view returns (uint256)",
  "function totalAssets() external view returns (uint256)"
]
```

## Important Notes

- USDC uses 6 decimals, wUSDC uses 18 decimals
- Min deposit: 1 USDC (1e6)
- Max deposit: 1M USDC (1e12)
- Always approve USDC before depositing
- No lock period - withdraw anytime

## Links

- **Contract:** https://basescan.org/address/0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2
- **API Reference:** [API.md](API.md)
- **Examples:** [../examples/](../examples/)
EOF
