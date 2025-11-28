const { Blockchain, Block } = require('./blockchain');

// Mock Balances Store (In-memory for simplicity, could be DB)
const balances = {
    'user_alice': 1000, // Initial SFT tokens
    'user_bob': 500,
    'user_charlie': 100,
    'current_user': 2500 // The logged-in user for the demo
};

class WalletSystem {
    constructor(blockchain) {
        this.blockchain = blockchain;
    }

    getBalance(userId) {
        return balances[userId] || 0;
    }

    transfer(fromUser, toUser, amount, reason) {
        const senderBalance = this.getBalance(fromUser);
        const transferAmount = parseFloat(amount);

        if (isNaN(transferAmount) || transferAmount <= 0) {
            throw new Error("Invalid amount");
        }

        if (senderBalance < transferAmount) {
            throw new Error("Insufficient funds");
        }

        // 1. Update Balances
        balances[fromUser] -= transferAmount;
        if (!balances[toUser]) balances[toUser] = 0;
        balances[toUser] += transferAmount;

        // 2. Record on Blockchain
        const transactionData = {
            type: 'TRANSFER',
            from: fromUser,
            to: toUser,
            amount: transferAmount,
            currency: 'INR',
            reason: reason,
            timestamp: new Date().toISOString()
        };

        const newBlock = new Block(
            this.blockchain.chain.length,
            new Date().toISOString(),
            transactionData
        );

        this.blockchain.addBlock(newBlock);

        return {
            success: true,
            txHash: newBlock.hash,
            timestamp: newBlock.timestamp,
            newBalance: balances[fromUser]
        };
    }
}

module.exports = { WalletSystem };
