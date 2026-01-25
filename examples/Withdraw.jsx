import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

const VAULT = '0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2';

export default function Withdraw() {
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    const load = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const vault = new ethers.Contract(VAULT, ['function balanceOf(address) view returns(uint256)'], provider);
      const bal = await vault.balanceOf(await signer.getAddress());
      setBalance(ethers.utils.formatUnits(bal, 18));
    };
    load();
  }, []);

  const withdraw = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const vault = new ethers.Contract(VAULT, ['function withdraw(uint256)','function balanceOf(address) view returns(uint256)'], signer);
    const bal = await vault.balanceOf(await signer.getAddress());
    await (await vault.withdraw(bal)).wait();
    alert('Done!');
  };

  return (
    <div>
      <p>Balance: {balance} wUSDC</p>
      <button onClick={withdraw}>Withdraw All</button>
    </div>
  );
}
