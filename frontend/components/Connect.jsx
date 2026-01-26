import { useState } from 'react';

export default function Connect({ onConnect }) {
  const [address, setAddress] = useState('');

  const connect = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAddress(accounts[0]);
    onConnect(accounts[0]);
  };

  return (
    <div>
      {address ? (
        <p>{address.slice(0,6)}...{address.slice(-4)}</p>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
}
