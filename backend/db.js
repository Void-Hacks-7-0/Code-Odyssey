const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database
const initDb = () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      transaction_id TEXT,
      timestamp TEXT,
      amount REAL,
      currency TEXT,
      payment_mode TEXT,
      device_id TEXT,
      ip TEXT,
      lat REAL,
      lon REAL,
      location TEXT,
      user_id TEXT,
      merchant TEXT,
      fraud_score INTEGER,
      risk_score INTEGER,
      features TEXT,
      rule_triggers TEXT
    )
  `;
    db.exec(createTableQuery);
    console.log('Database initialized and table "transactions" ready.');
};

// Insert a transaction
const insertTransaction = (tx) => {
    const stmt = db.prepare(`
    INSERT INTO transactions (
      id, transaction_id, timestamp, amount, currency, payment_mode, 
      device_id, ip, lat, lon, location, user_id, merchant, 
      fraud_score, risk_score, features, rule_triggers
    ) VALUES (
      @id, @transaction_id, @timestamp, @amount, @currency, @payment_mode, 
      @device_id, @ip, @lat, @lon, @location, @user_id, @merchant, 
      @fraud_score, @risk_score, @features, @rule_triggers
    )
  `);

    // Serialize objects to JSON strings
    const data = {
        ...tx,
        features: JSON.stringify(tx.features),
        rule_triggers: JSON.stringify(tx.rule_triggers)
    };

    try {
        stmt.run(data);
        // console.log(`Transaction ${tx.id} inserted.`);
    } catch (err) {
        console.error('Error inserting transaction:', err);
        throw err;
    }
};

// Get recent transactions
const getRecentTransactions = (limit = 100) => {
    const stmt = db.prepare('SELECT * FROM transactions ORDER BY timestamp DESC LIMIT ?');
    const rows = stmt.all(limit);

    // Parse JSON strings back to objects
    return rows.map(row => ({
        ...row,
        features: JSON.parse(row.features),
        rule_triggers: JSON.parse(row.rule_triggers)
    }));
};

// Get all transactions (use with caution on large datasets)
const getAllTransactions = () => {
    const stmt = db.prepare('SELECT * FROM transactions ORDER BY timestamp DESC');
    const rows = stmt.all();
    return rows.map(row => ({
        ...row,
        features: JSON.parse(row.features),
        rule_triggers: JSON.parse(row.rule_triggers)
    }));
};

module.exports = {
    initDb,
    insertTransaction,
    getRecentTransactions,
    getAllTransactions
};
