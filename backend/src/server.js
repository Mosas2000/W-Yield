const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
app.use(cors());
app.use(express.json());

const VAULT = '0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2';
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');

app.get('/api/stats', async (req, res) => {
    const vault = new ethers.Contract(VAULT, [
        'function totalAssets() view returns(uint256)',
        'function totalSupply() view returns(uint256)',
        'function performanceFee() view returns(uint256)'
    ], provider);
    
    const tvl = await vault.totalAssets();
    const supply = await vault.totalSupply();
    const fee = await vault.performanceFee();
    
    res.json({
        tvl: ethers.utils.formatUnits(tvl, 6),
        supply: ethers.utils.formatUnits(supply, 18),
        fee: fee.toNumber() / 100
    });
});

app.get('/api/user/:address', async (req, res) => {
    const vault = new ethers.Contract(VAULT, [
        'function balanceOf(address) view returns(uint256)',
        'function convertToAssets(uint256) view returns(uint256)'
    ], provider);
    
    const shares = await vault.balanceOf(req.params.address);
    const assets = await vault.convertToAssets(shares);
    
    res.json({
        shares: ethers.utils.formatUnits(shares, 18),
        assets: ethers.utils.formatUnits(assets, 6)
    });
});

app.listen(3000, () => console.log('Server running on :3000'));
