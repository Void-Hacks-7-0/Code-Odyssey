/**
 * PMLA (Prevention of Money Laundering Act) Compliance Module
 * Detects patterns like Structuring (Smurfing) and High Value Transactions.
 */

const checkPMLA = (transaction) => {
    const triggers = [];
    const amount = transaction.amount;

    // Rule 1: Structuring / Smurfing
    // Detects transactions just below the reporting threshold (e.g., 50,000 INR)
    // Range: 45,000 - 49,999
    if (amount >= 45000 && amount < 50000) {
        triggers.push("PMLA_STRUCTURING_ALERT");
    }

    // Rule 2: High Value Transaction (CTR Reporting)
    // Detects transactions exceeding the mandatory reporting limit (e.g., 10 Lakhs)
    if (amount >= 1000000) {
        triggers.push("PMLA_HIGH_VALUE_CTR");
    }

    // Rule 3: Round Number Anomaly (often used in laundering)
    // e.g., 50000, 100000 exactly
    if (amount > 10000 && amount % 10000 === 0) {
        triggers.push("PMLA_ROUND_FIGURE");
    }

    return triggers;
};

module.exports = { checkPMLA };
