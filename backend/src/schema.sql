CREATE TABLE deposits (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    amount_usdc NUMERIC(18,6) NOT NULL,
    shares NUMERIC(18,18) NOT NULL,
    block_number INTEGER NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    UNIQUE(tx_hash)
);

CREATE TABLE withdrawals (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    shares NUMERIC(18,18) NOT NULL,
    amount_usdc NUMERIC(18,6) NOT NULL,
    block_number INTEGER NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    UNIQUE(tx_hash)
);

CREATE INDEX idx_deposits_user ON deposits(user_address);
CREATE INDEX idx_deposits_block ON deposits(block_number);
CREATE INDEX idx_withdrawals_user ON withdrawals(user_address);
CREATE INDEX idx_withdrawals_block ON withdrawals(block_number);
