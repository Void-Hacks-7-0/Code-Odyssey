require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const morgan = require('morgan');
const { generateTransaction } = require('./generator');
const { checkPMLA } = require('./pmla');
const { initDb, insertTransaction, getRecentTransactions } = require('./db');
const { Blockchain, Block } = require('./blockchain');

// Initialize Database
initDb();
const PORT = process.env.PORT || 4000;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const WS_TOKEN = process.env.WS_TOKEN || '';
const ENABLE_MOCK_DATA = process.env.ENABLE_MOCK_DATA !== 'false'; // Default to true

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(morgan('combined'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// --- In-Memory Cache for WebSocket Broadcasting ---
// We'll keep a small buffer for new connections, but main history is in DB
let transactionHistory = [];
const MAX_HISTORY = 100;
// const actionsLog = []; // REPLACED BY BLOCKCHAIN

// Initialize Blockchain
const auditBlockchain = new Blockchain();



wss.on('connection', async (ws, req) => {
  // Simple token auth via query param
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token') || '';
    if (WS_TOKEN && token !== WS_TOKEN) {
      ws.close(1008, 'Unauthorized');
      return;
    }
  } catch (e) {
    // ignore parsing
  }

  console.log('Client connected. Total clients:', wss.clients.size);
  // Send recent history from DB
  const recent = await getRecentTransactions(50);
  ws.send(JSON.stringify({ type: 'HISTORY', data: recent }));

  ws.on('close', () => console.log('Client disconnected'));
});

const broadcast = (data) => {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};

const startSimulation = () => {
  const delay = Math.floor(Math.random() * (1200 - 300 + 1) + 300);
  setTimeout(() => {
    const tx = generateTransaction();

    // Apply PMLA Checks
    const pmlaTriggers = checkPMLA(tx);
    if (pmlaTriggers.length > 0) {
      tx.rule_triggers.push(...pmlaTriggers);
      // Increase fraud score if PMLA rules are triggered
      tx.fraud_score = Math.max(tx.fraud_score, 85);
    }

    // 2. Persist to DB
    insertTransaction(tx);

    // 3. Update in-memory cache for immediate broadcast/history
    transactionHistory.push(tx);
    if (transactionHistory.length > MAX_HISTORY) transactionHistory.shift();

    // 4. Broadcast via WebSocket
    broadcast({ type: 'TX', data: tx });

    // Recurse
    startSimulation();
  }, delay);
};

// Start the simulation loop
// Start the simulation loop if enabled
if (ENABLE_MOCK_DATA) {
  console.log("Mock data generation ENABLED.");
  startSimulation();
} else {
  console.log("Mock data generation DISABLED.");
}

app.get('/', (req, res) => {
  res.json({ status: 'RealtimeGuard Simulator Running', clients: wss.clients.size });
});

app.get('/api/latest', async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const transactions = await getRecentTransactions(limit);
  res.json(transactions);
});

app.post('/api/action', async (req, res) => {
  const { transaction_id, action, notes } = req.body;
  if (!transaction_id || !action) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Check for duplicate in blockchain
  // We skip the genesis block (index 0)
  const existing = auditBlockchain.chain.slice(1).find(block => block.data.id === transaction_id);
  if (existing) {
    console.log(`Duplicate action ignored for tx: ${transaction_id}`);
    return res.json({ success: true, message: "Action already recorded" });
  }

  const record = { id: transaction_id, action, notes };
  const newBlock = new Block(
    auditBlockchain.chain.length,
    new Date().toISOString(),
    record
  );
  auditBlockchain.addBlock(newBlock);

  if (SLACK_WEBHOOK_URL) {
    const color = action === 'BLOCK' ? '#FF0000' : '#36a64f';
    axios.post(SLACK_WEBHOOK_URL, {
      attachments: [{ color, text: `*Action:* ${action}\n*Tx:* ${transaction_id}\n*Notes:* ${notes || 'N/A'}\n*Hash:* ${newBlock.hash}` }]
    }).catch(err => console.error("Slack error:", err.message));
  }
  res.json({ success: true, hash: newBlock.hash });
});

app.get('/api/actions', (req, res) => {
  // Return chain excluding genesis block, reversed for UI
  const chainData = auditBlockchain.chain.slice(1).map(block => ({
    ...block.data,
    timestamp: block.timestamp,
    hash: block.hash,
    previousHash: block.previousHash,
    index: block.index,
    signature: block.signature,
    signer: block.signer
  }));
  res.json(chainData.reverse());
});

app.get('/api/blockchain/verify', (req, res) => {
  // Reload chain from disk to capture any manual file edits (Hot Reload)
  auditBlockchain.loadChain();
  const validationResult = auditBlockchain.isChainValid();

  if (!validationResult.valid) {
    // Process all errors
    const detailedErrors = validationResult.errors.map(err => {
      const signerAddress = err.block.signer;
      // Find all blocks signed by this user
      const signerHistory = auditBlockchain.chain
        .filter(b => b.signer === signerAddress)
        .map(b => ({
          index: b.index,
          timestamp: b.timestamp,
          id: b.data.id,
          action: b.data.action,
          hash: b.hash
        }));

      return {
        ...err,
        signerHistory
      };
    });

    res.json({
      valid: false,
      chainLength: auditBlockchain.chain.length,
      errors: detailedErrors
    });
  } else {
    res.json({ valid: true, chainLength: auditBlockchain.chain.length });
  }
});

// Endpoint to ingest external transactions
app.post('/api/transaction', (req, res) => {
  const data = req.body;

  // Validate basic fields
  if (!data.amount || !data.merchant) {
    return res.status(400).json({ error: "Missing required fields: amount, merchant" });
  }

  // Fill in defaults for missing fields to prevent frontend crash
  const txId = data.id || `ext_${Date.now()}`;
  const transaction = {
    id: txId,
    transaction_id: txId,
    timestamp: data.timestamp || new Date().toISOString(),
    amount: parseFloat(data.amount),
    currency: data.currency || "USD",
    payment_mode: data.payment_mode || "UNKNOWN",
    device_id: data.device_id || "unknown_device",
    ip: data.ip || "127.0.0.1",
    lat: data.lat || 0,
    lon: data.lon || 0,
    location: data.location || "Unknown Location",
    user_id: data.user_id || "external_user",
    merchant: data.merchant,
    fraud_score: data.fraud_score || 0,
    risk_score: data.fraud_score || 0,
    features: data.features || {},
    rule_triggers: data.rule_triggers || []
  };

  // Apply PMLA Checks
  const pmlaTriggers = checkPMLA(transaction);
  if (pmlaTriggers.length > 0) {
    transaction.rule_triggers.push(...pmlaTriggers);
    // Increase fraud score if PMLA rules are triggered
    transaction.fraud_score = Math.max(transaction.fraud_score, 90);
  }

  // Add to history and broadcast
  transactionHistory.push(transaction);
  if (transactionHistory.length > MAX_HISTORY) transactionHistory.shift();

  // Persist to disk
  saveTransactions();

  broadcast({ type: 'TX', data: transaction });

  res.json({ success: true, id: txId, triggers: pmlaTriggers });
});

server.listen(PORT, () => {
  console.log(`🚀 Simulator running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket stream available at ws://localhost:${PORT}`);
});
