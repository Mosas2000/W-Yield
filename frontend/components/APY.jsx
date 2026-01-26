import { useState } from 'react';

export default function APY() {
  const [amount, setAmount] = useState('100');
  const apy = 20; // hardcoded for now
  
  const yearly = (parseFloat(amount) * apy / 100).toFixed(2);
  const monthly = (yearly / 12).toFixed(2);

  return (
    <div>
      <h2>Earnings Calculator</h2>
      <input 
        type="number" 
        value={amount} 
        onChange={e => setAmount(e.target.value)}
      />
      <p>At {apy}% APY:</p>
      <p>Monthly: ${monthly}</p>
      <p>Yearly: ${yearly}</p>
    </div>
  );
}
