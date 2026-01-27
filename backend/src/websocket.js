const WebSocket = require('ws');
const { ethers } = require('ethers');

const wss = new WebSocket.Server({ port: 8080 });
const VAULT = '0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2';
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    const vault = new ethers.Contract(VAULT, [
        'event Deposit(address indexed user, uint256 usdcAmount, uint256 shares)',
        'event Withdraw(address indexed user, uint256 shares, uint256 usdcAmount)'
    ], provider);
    
    vault.on('Deposit', (user, amount, shares) => {
        ws.send(JSON.stringify({
            type: 'deposit',
            user,
            amount: ethers.utils.formatUnits(amount, 6)
        }));
    });
    
    vault.on('Withdraw', (user, shares, amount) => {
        ws.send(JSON.stringify({
            type: 'withdraw',
            user,
            amount: ethers.utils.formatUnits(amount, 6)
        }));
    });
});

console.log('WebSocket server running on :8080');
