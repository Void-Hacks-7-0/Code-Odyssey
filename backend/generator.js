const { v4: uuidv4 } = require('uuid');

// --- Mock Data Pools ---
const CITIES = [
  { city: "Mumbai", country: "IN", lat: 19.0760, lon: 72.8777 },
  { city: "Delhi", country: "IN", lat: 28.7041, lon: 77.1025 },
  { city: "Bangalore", country: "IN", lat: 12.9716, lon: 77.5946 },
  { city: "Chennai", country: "IN", lat: 13.0827, lon: 80.2707 },
  { city: "Kolkata", country: "IN", lat: 22.5726, lon: 88.3639 },
  { city: "Hyderabad", country: "IN", lat: 17.3850, lon: 78.4867 },
  { city: "Pune", country: "IN", lat: 18.5204, lon: 73.8567 },
  { city: "Ahmedabad", country: "IN", lat: 23.0225, lon: 72.5714 },
  { city: "Jaipur", country: "IN", lat: 26.9124, lon: 75.7873 },
  { city: "Lucknow", country: "IN", lat: 26.8467, lon: 80.9462 }
];

const MERCHANTS = [
  "Amazon India", "Flipkart", "Uber", "Swiggy", "Zomato", "Steam Games",
  "CryptoBin", "Unknown Merchant", "Apple Store", "Netflix"
];

const USERS = [
  "user_alice", "user_bob", "user_charlie", "user_dave", "user_eve"
];

const PAYMENT_MODES = ["UPI", "CARD", "WALLET", "NETBANKING"];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate an IP address (Skewed towards IN)
const generateIP = () => {
  return `103.${randomInt(10, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}`;
};

const generateTransaction = () => {
  const isFraud = Math.random() < 0.15;
  let loc = randomItem(CITIES);
  let merchant = randomItem(MERCHANTS);
  let mode = randomItem(PAYMENT_MODES);
  let user = randomItem(USERS);

  let velocity = randomInt(1, 5);
  let deviceAge = randomInt(30, 800);
  let failedLogins = 0;
  let ruleTriggers = [];
  let riskScore = randomInt(1, 40);

  if (isFraud) {
    riskScore = randomInt(75, 99);
    if (Math.random() > 0.5) {
      velocity = randomInt(15, 50);
      failedLogins = randomInt(2, 10);
      ruleTriggers.push("VELOCITY_SPIKE");
      if (failedLogins > 3) ruleTriggers.push("MULTIPLE_FAILED_LOGINS");
    } else {
      deviceAge = randomInt(0, 2);
      // Pick a random city different from the current one for GEO_MISMATCH simulation if needed
      // For now, just flagging NEW_DEVICE
      ruleTriggers.push("NEW_DEVICE");
    }
  }

  let amount = randomInt(50, 5000);
  if (mode === "UPI") amount = randomInt(10, 2000);
  if (isFraud && mode === "CARD") amount = randomInt(5000, 50000);

  const txId = uuidv4();

  // --- DEMO SCENARIO: The "Money Launderer" ---
  // Every ~5th transaction is a "Structuring" attempt (Just below 50k)
  if (Math.random() < 0.2) {
    user = "launderer_joe";
    amount = 49900; // Classic "Smurfing" amount
    merchant = "Shell Corp LLC";
    riskScore = 95;
    ruleTriggers.push("PMLA_STRUCTURING_ALERT");
  }

  const tx = {
    id: txId, // Frontend expects 'id'
    transaction_id: txId, // Backend legacy
    timestamp: new Date().toISOString(),
    amount,
    currency: (loc.country === 'IN') ? "INR" : "USD",
    payment_mode: mode,
    device_id: `dev_${uuidv4().slice(0, 8)}`,
    ip: generateIP(),

    // Flattened location for Frontend
    lat: loc.lat,
    lon: loc.lon,
    location: `${loc.city}, ${loc.country}`,

    user_id: user, // New field for Geo-Jumps

    merchant,
    fraud_score: riskScore, // Frontend expects 'fraud_score'
    risk_score: riskScore, // Backend legacy

    features: {
      velocity,
      device_age_days: deviceAge,
      failed_logins: failedLogins
    },
    rule_triggers: ruleTriggers
  };

  return tx;
};

module.exports = { generateTransaction };
