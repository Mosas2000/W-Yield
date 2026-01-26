# W-Yield Frontend Components

React components for building a W-Yield vault interface.

## 🎨 Components

### App.jsx
Main application layout with wallet connection and component orchestration.

**Features:**
- Wallet connection handling
- Conditional rendering based on connection status
- Integrates all components

### Dashboard.jsx
Display user's vault position and statistics.

**Shows:**
- wUSDC balance (shares)
- USDC value of shares
- Total vault TVL

### History.jsx
Transaction history with deposits and withdrawals.

**Features:**
- Fetches on-chain events
- Displays deposit/withdraw history
- Sorted by block number

### Connect.jsx
Wallet connection button with address display.

**Features:**
- MetaMask connection
- Shortened address display
- Connection state management

### APY.jsx
Earnings calculator with estimated returns.

**Features:**
- Interactive amount input
- Monthly/yearly earnings projection
- Based on 20% APY (example)

## 🚀 Usage

### Installation

```bash
npm install ethers@5 react react-dom
```

### Basic Setup

```jsx
import App from './frontend/App';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### Using Individual Components

```jsx
import Dashboard from './frontend/components/Dashboard';
import Connect from './frontend/components/Connect';

function MyApp() {
  return (
    <>
      <Connect onConnect={(addr) => console.log(addr)} />
      <Dashboard />
    </>
  );
}
```

## 📦 Dependencies

- **ethers.js v5** - Ethereum interactions
- **React** - UI framework
- **window.ethereum** - MetaMask provider

## 🔗 Integration

Components automatically connect to the deployed contract:
- **Address:** `0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2`
- **Network:** Base Mainnet (8453)

## 💡 Customization

### Change APY
Edit `APY.jsx`:
```jsx
const apy = 20; // Change this value
```

### Add Styling
All components use inline styles for simplicity. Wrap with your CSS framework:

```jsx
<div className="your-wrapper">
  <Dashboard />
</div>
```

### Error Handling
Add try/catch blocks to component hooks:

```jsx
try {
  const balance = await vault.balanceOf(addr);
} catch (error) {
  console.error('Failed to load balance', error);
}
```

## 🎯 Next Steps

1. Add CSS styling
2. Implement error boundaries
3. Add loading states
4. Create mobile responsive design
5. Add transaction confirmations

## 📝 Notes

- Components use ethers.js v5 syntax
- Requires MetaMask or compatible wallet
- All contract calls are read-only except in Deposit/Withdraw
- History component may be slow with many transactions

---

Built by cryptosecure.base.eth
