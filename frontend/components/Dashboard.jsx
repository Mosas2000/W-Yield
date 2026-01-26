import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

const VAULT = '0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2';

export default function Dashboard() {
  const [stats, setStats] = useState({ shares: '0', usdc: '0', total: '0' });

  useEffect(() => {
    const load = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      
      const vault = new ethers.Contract(VAULT, [
        'function balanceOf(address) view returns(uint256)',
        'function convertToAssets(uint256) view returns(uint256)',
        'function totalAssets() view returns(uint256)'
      ], provider);
      
      const shares = await vault.balanceOf(addr);
      const usdc = await vault.convertToAssets(shares);
      const total = await vault.totalAssets();
      
      setStats({
        shares: ethers.utils.formatUnits(shares, 18),
        usdc: ethers.utils.formatUnits(usdc, 6),
        total: ethers.utils.formatUnits(total, 6)
      });
    };
    load();
  }, []);

  return (
    <div>
      <h2>Your Position</h2>
      <p>wUSDC: {stats.shares}</p>
      <p>Value: ${stats.usdc} USDC</p>
      <p>Total Vault: ${stats.total} USDC</p>
    </div>
  );
}
