const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../backend/data/database.sqlite');

try {
    const db = new Database(dbPath, { readonly: true });

    // Get count
    const count = db.prepare('SELECT COUNT(*) as count FROM transactions').get();
    console.log(`\nTotal Transactions: ${count.count}`);

    // Get recent 10
    const rows = db.prepare('SELECT timestamp, merchant, amount, currency, location, fraud_score FROM transactions ORDER BY timestamp DESC LIMIT 10').all();

    console.log('\n--- Recent 10 Transactions ---');
    console.table(rows);

} catch (err) {
    console.error("Error opening database:", err.message);
    console.log("Make sure the backend has started at least once to create the database.");
}
