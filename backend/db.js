const Datastore = require('nedb');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'database.db');
const db = new Datastore({ filename: dbPath, autoload: true });

// Initialize database (NeDB doesn't need explicit table creation)
const initDb = () => {
    console.log('NeDB (MongoDB-compatible) initialized.');
};

// Insert a transaction
const insertTransaction = (tx) => {
    // NeDB handles JSON objects natively, no need to stringify features/triggers manually
    // unless we want to keep exact compatibility with the old SQLite structure.
    // For "MongoDB" feel, we store objects directly.

    db.insert(tx, (err, newDoc) => {
        if (err) {
            console.error('Error inserting transaction:', err);
        }
    });
};

// Get recent transactions
const getRecentTransactions = (limit = 100) => {
    // NeDB is async by default, but for this synchronous-style legacy API,
    // we might need to wrap it or use a promise-based approach.
    // However, since the original code expected a return value immediately,
    // and NeDB is callback-based, we have a mismatch.
    // To fix this without rewriting the whole app to async/await,
    // we will use a simple "in-memory" buffer for the immediate return
    // or we can use 'deasync' but that's risky.

    // BETTER APPROACH: The original server.js calls this synchronously?
    // Let's check server.js. It calls it in `app.get` and `wss.on`.
    // We should probably make this async and update server.js.
    // BUT to keep changes minimal, let's see if we can just return a promise
    // and handle it in server.js.

    // Actually, let's just use a Promise here and update server.js to await it.
    // It's the cleanest way.
    return new Promise((resolve, reject) => {
        db.find({}).sort({ timestamp: -1 }).limit(limit).exec((err, docs) => {
            if (err) reject(err);
            else resolve(docs);
        });
    });
};

// Get all transactions
const getAllTransactions = () => {
    return new Promise((resolve, reject) => {
        db.find({}).sort({ timestamp: -1 }).exec((err, docs) => {
            if (err) reject(err);
            else resolve(docs);
        });
    });
};

module.exports = {
    initDb,
    insertTransaction,
    getRecentTransactions,
    getAllTransactions
};
