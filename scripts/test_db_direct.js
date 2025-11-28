const { initDb, insertTransaction, getRecentTransactions } = require('../backend/db');

const uuidv4 = () => Math.random().toString(36).substring(7);

console.log("Initializing DB...");
initDb();

const tx = {
    id: uuidv4(),
    transaction_id: uuidv4(),
    timestamp: new Date().toISOString(),
    amount: 100.50,
    currency: 'INR',
    payment_mode: 'UPI',
    device_id: 'dev_test',
    ip: '127.0.0.1',
    lat: 19.0760,
    lon: 72.8777,
    location: 'Mumbai, IN',
    user_id: 'user_test',
    merchant: 'Test Merchant',
    fraud_score: 10,
    risk_score: 10,
    features: { velocity: 1, device_age_days: 100, failed_logins: 0 },
    rule_triggers: []
};

console.log("Inserting transaction...");
try {
    insertTransaction(tx);
    console.log("Insertion successful.");
} catch (err) {
    console.error("Insertion failed:", err);
}

console.log("Retrieving transactions...");
const recent = getRecentTransactions(10);
console.log(`Retrieved ${recent.length} transactions.`);
console.log(recent[0]);
