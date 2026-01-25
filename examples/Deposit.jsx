import { ethers } from 'ethers';
import { useState } from 'react';

const VAULT = '0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2';
const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export default function Deposit() {
  const [amount, setAmount] = useState('');

  const deposit = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const amt = ethers.utils.parseUnits(amount, 6);
    
    const usdc = new ethers.Contract(USDC, ['function approve(address,uint256)'], signer);
    await (await usdc.approve(VAULT, amt)).wait();
    
    const vault = new ethers.Contract(VAULT, ['function deposit(uint256)'], signer);
    await (await vault.deposit(amt)).wait();
    
    alert('Done!');
  };

  return (
    <div>
      <input value={amount} onChange={e => setAmount(e.target.value)} />
      <button onClick={deposit}>Deposit</button>
    </div>
  );
}
