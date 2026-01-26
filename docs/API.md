# API Reference

## deposit(uint256 amount)
Deposit USDC, get wUSDC shares

**Parameters:**
- `amount`: USDC amount to deposit (in 6 decimals)

**Returns:**
- `shares`: wUSDC shares minted (in 18 decimals)

**Requirements:**
- Amount must be >= MIN_DEPOSIT (1 USDC)
- Amount must be <= MAX_DEPOSIT (1M USDC)
- Must approve USDC first

## withdraw(uint256 shares)
Burn wUSDC, get USDC back

**Parameters:**
- `shares`: wUSDC shares to burn (in 18 decimals)

**Returns:**
- `amount`: USDC withdrawn (in 6 decimals)

**Requirements:**
- Must have sufficient wUSDC balance

## balanceOf(address)
Get wUSDC balance

**Parameters:**
- `address`: Account address

**Returns:**
- `balance`: wUSDC balance (in 18 decimals)

## convertToAssets(uint256 shares)
Calculate USDC value of wUSDC

**Parameters:**
- `shares`: wUSDC amount (in 18 decimals)

**Returns:**
- `assets`: Equivalent USDC value (in 6 decimals)

## convertToShares(uint256 assets)
Calculate wUSDC for USDC amount

**Parameters:**
- `assets`: USDC amount (in 6 decimals)

**Returns:**
- `shares`: Equivalent wUSDC shares (in 18 decimals)

## totalAssets()
Total USDC in vault

**Returns:**
- `total`: Total USDC balance (in 6 decimals)
EOF
