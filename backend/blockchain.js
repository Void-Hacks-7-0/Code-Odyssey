const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.data) +
                this.nonce
            )
            .digest('hex');
    }
}

class Blockchain {
    constructor() {
        this.chainFile = path.join(__dirname, 'data', 'blockchain.json');
        this.chain = [this.createGenesisBlock()];
        this.loadChain();
    }

    createGenesisBlock() {
        return new Block(0, "2024-01-01", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
        this.saveChain();
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Re-calculate hash to ensure data hasn't been tampered with
            // We need to reconstruct the Block object methods since JSON.parse doesn't keep them
            const reconstructedBlock = new Block(
                currentBlock.index,
                currentBlock.timestamp,
                currentBlock.data,
                currentBlock.previousHash
            );
            reconstructedBlock.nonce = currentBlock.nonce; // If we had PoW

            if (currentBlock.hash !== reconstructedBlock.calculateHash()) {
                console.log(`Invalid Hash at block ${i}`);
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(`Invalid Previous Link at block ${i}`);
                return false;
            }
        }
        return true;
    }

    saveChain() {
        // Ensure data dir exists
        const dir = path.dirname(this.chainFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(this.chainFile, JSON.stringify(this.chain, null, 2));
    }

    loadChain() {
        if (fs.existsSync(this.chainFile)) {
            try {
                const data = JSON.parse(fs.readFileSync(this.chainFile, 'utf8'));
                if (data && data.length > 0) {
                    this.chain = data;
                }
            } catch (err) {
                console.error("Error loading blockchain:", err);
            }
        }
    }
}

module.exports = { Blockchain, Block };
