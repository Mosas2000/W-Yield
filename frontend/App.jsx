import { useState } from 'react';
import Connect from './components/Connect';
import Dashboard from './components/Dashboard';
import Deposit from '../examples/Deposit';
import Withdraw from '../examples/Withdraw';
import History from './components/History';
import APY from './components/APY';

export default function App() {
  const [connected, setConnected] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>W-Yield</h1>
      <Connect onConnect={() => setConnected(true)} />
      
      {connected && (
        <>
          <Dashboard />
          <APY />
          <Deposit />
          <Withdraw />
          <History />
        </>
      )}
    </div>
  );
}
