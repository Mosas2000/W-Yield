const { ethers } = require('ethers');
const fs = require('fs');

const VAULT = '0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2';
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');

async function indexEvents() {
    const vault = new ethers.Contract(VAULT, [
        'event Deposit(address indexed user, uint256 usdcAmount, uint256 shares)',
        'event Withdraw(address indexed user, uint256 shares, uint256 usdcAmount)'
    ], provider);
    
    console.log('Indexing events...');
    
    const deposits = await vault.queryFilter(vault.filters.Deposit());
    const withdraws = await vault.queryFilter(vault.filters.Withdraw());
    
    const events = [
        ...deposits.map(e => ({
            type: 'deposit',
            user: e.args.user,
            amount: ethers.utils.formatUnits(e.args.usdcAmount, 6),
            block: e.blockNumber,
            tx: e.transactionHash
        })),
        ...withdraws.map(e => ({
            type: 'withdraw',
            user: e.args.user,
            amount: ethers.utils.formatUnits(e.args.usdcAmount, 6),
            block: e.blockNumber,
            tx: e.transactionHash
        }))
    ].sort((a, b) => a.block - b.block);
    
    fs.writeFileSync('events.json', JSON.stringify(events, null, 2));
    console.log(`Indexed ${events.length} events`);
}

indexEvents();
