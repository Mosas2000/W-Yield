import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

const VAULT = '0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2';

export default function History() {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      
      const vault = new ethers.Contract(VAULT, [
        'event Deposit(address indexed user, uint256 usdcAmount, uint256 shares)',
        'event Withdraw(address indexed user, uint256 shares, uint256 usdcAmount)'
      ], provider);
      
      const deposits = await vault.queryFilter(vault.filters.Deposit(addr));
      const withdraws = await vault.queryFilter(vault.filters.Withdraw(addr));
      
      const all = [...deposits, ...withdraws].map(e => ({
        type: e.event,
        amount: ethers.utils.formatUnits(e.args.usdcAmount || e.args[1], 6),
        block: e.blockNumber
      }));
      
      setTxs(all.sort((a,b) => b.block - a.block));
    };
    load();
  }, []);

  return (
    <div>
      <h2>History</h2>
      {txs.map((tx, i) => (
        <div key={i}>
          <span>{tx.type}: ${tx.amount} USDC</span>
        </div>
      ))}
    </div>
  );
}
