from web3 import Web3

w3 = Web3(Web3.HTTPProvider('https://mainnet.base.org'))
VAULT = '0x4F6c2D2bc33f032dbd74e617c32602bCBfFd3Fb2'

def get_balance(address):
    vault = w3.eth.contract(address=VAULT, abi=[{"inputs":[{"type":"address"}],"name":"balanceOf","outputs":[{"type":"uint256"}],"stateMutability":"view","type":"function"}])
    return vault.functions.balanceOf(address).call()

def deposit(private_key, amount_usdc):
    account = w3.eth.account.from_key(private_key)
    amt = int(amount_usdc * 10**6)
    
    # Approve
    usdc = w3.eth.contract(address='0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', abi=[{"inputs":[{"type":"address"},{"type":"uint256"}],"name":"approve","outputs":[{"type":"bool"}],"type":"function"}])
    tx = usdc.functions.approve(VAULT, amt).build_transaction({'from': account.address, 'nonce': w3.eth.get_transaction_count(account.address)})
    signed = w3.eth.account.sign_transaction(tx, private_key)
    w3.eth.send_raw_transaction(signed.rawTransaction)
    
    # Deposit
    vault = w3.eth.contract(address=VAULT, abi=[{"inputs":[{"type":"uint256"}],"name":"deposit","outputs":[{"type":"uint256"}],"type":"function"}])
    tx = vault.functions.deposit(amt).build_transaction({'from': account.address, 'nonce': w3.eth.get_transaction_count(account.address)})
    signed = w3.eth.account.sign_transaction(tx, private_key)
    return w3.eth.send_raw_transaction(signed.rawTransaction)
