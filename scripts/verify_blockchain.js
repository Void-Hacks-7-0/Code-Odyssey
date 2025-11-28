const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:4000/api';
const CHAIN_FILE = path.join(__dirname, '../backend/data/blockchain.json');

async function runVerification() {
    console.log("1. Testing Block Creation...");
    try {
        const txId = `test_tx_${Date.now()}`;
        const res = await fetch(`${API_URL}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                transaction_id: txId,
                action: 'BLOCK',
                notes: 'Verification Test'
            })
        });
        const data = await res.json();

        if (data.success && data.hash) {
            console.log("✅ Block created successfully. Hash:", data.hash);
        } else {
            console.error("❌ Failed to create block:", data);
            return;
        }

        console.log("\n2. Verifying Chain Integrity (API)...");
        const verifyRes = await fetch(`${API_URL}/blockchain/verify`);
        const verifyData = await verifyRes.json();
        if (verifyData.valid) {
            console.log("✅ Chain is VALID. Length:", verifyData.chainLength);
        } else {
            console.error("❌ Chain is INVALID!");
            return;
        }

        console.log("\n3. Simulating Tampering...");
        // Read the file
        const chainData = JSON.parse(fs.readFileSync(CHAIN_FILE, 'utf8'));
        // Tamper with the last block's data
        const lastBlock = chainData[chainData.length - 1];
        lastBlock.data.notes = "TAMPERED DATA";
        // Save it back
        fs.writeFileSync(CHAIN_FILE, JSON.stringify(chainData, null, 2));
        console.log("⚠️  Tampered with blockchain.json manually.");

        console.log("\n4. Verifying Chain Integrity after Tampering...");
        const verifyTamperRes = await fetch(`${API_URL}/blockchain/verify`);
        const verifyTamperData = await verifyTamperRes.json();
        if (!verifyTamperData.valid) {
            console.log("✅ Tampering DETECTED! Chain is correctly marked as INVALID.");
        } else {
            console.error("❌ Failed to detect tampering! Chain reported as valid.");
        }

        // Restore file (optional, but good for cleanup)
        // Actually, let's leave it broken so the user can see the "Invalid" state in UI if they want, 
        // or maybe we should fix it to be nice. 
        // Let's fix it to be nice.
        console.log("\n5. Restoring Chain...");
        lastBlock.data.notes = "Verification Test";
        fs.writeFileSync(CHAIN_FILE, JSON.stringify(chainData, null, 2));
        console.log("✅ Chain restored.");

    } catch (error) {
        console.error("❌ Verification Failed:", error.message);
        if (error.cause && error.cause.code === 'ECONNREFUSED') {
            console.log("💡 Is the backend server running?");
        }
    }
}

runVerification();
