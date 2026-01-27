// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract WealthVaultV2 is ERC20, Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable usdc;
    uint256 public performanceFee;
    address public feeRecipient;
    
    uint256 public constant MIN_DEPOSIT = 1e6;
    uint256 public constant MAX_DEPOSIT = 1000000e6;
    uint256 public constant MAX_FEE = 1000;
    uint256 public constant BASIS_POINTS = 10000;
    
    event Deposit(address indexed user, uint256 usdcAmount, uint256 shares);
    event Withdraw(address indexed user, uint256 shares, uint256 usdcAmount);
    event FeeUpdated(uint256 newFee);
    event FeeRecipientUpdated(address newRecipient);
    
    constructor(address _usdc) ERC20("W-Yield USDC", "wUSDC") Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC");
        usdc = IERC20(_usdc);
        performanceFee = 200;
        feeRecipient = msg.sender;
    }
    
    function totalAssets() public view returns (uint256) {
        return usdc.balanceOf(address(this));
    }
    
    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? assets : (assets * supply) / totalAssets();
    }
    
    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 supply = totalSupply();
        return supply == 0 ? shares : (shares * totalAssets()) / supply;
    }
    
    function deposit(uint256 amount) external nonReentrant whenNotPaused returns (uint256 shares) {
        require(amount >= MIN_DEPOSIT, "Below minimum");
        require(amount <= MAX_DEPOSIT, "Above maximum");
        
        shares = convertToShares(amount);
        require(shares > 0, "Zero shares");
        
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, shares);
        
        emit Deposit(msg.sender, amount, shares);
    }
    
    function withdraw(uint256 shares) external nonReentrant returns (uint256 amount) {
        require(shares > 0, "Zero shares");
        require(balanceOf(msg.sender) >= shares, "Insufficient balance");
        
        amount = convertToAssets(shares);
        require(amount > 0, "Zero amount");
        
        _burn(msg.sender, shares);
        usdc.safeTransfer(msg.sender, amount);
        
        emit Withdraw(msg.sender, shares, amount);
    }
    
    function setPerformanceFee(uint256 _fee) external onlyOwner {
        require(_fee <= MAX_FEE, "Fee too high");
        performanceFee = _fee;
        emit FeeUpdated(_fee);
    }
    
    function setFeeRecipient(address _recipient) external onlyOwner {
        require(_recipient != address(0), "Invalid address");
        feeRecipient = _recipient;
        emit FeeRecipientUpdated(_recipient);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
}
