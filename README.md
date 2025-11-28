# RealtimeGuard 🛡️
### AI-Powered Fraud Detection & Blockchain Audit System

RealtimeGuard is a cutting-edge financial security dashboard that monitors transactions in real-time, detects money laundering patterns (PMLA compliance), and secures analyst decisions using an immutable **Ethereum-based Blockchain**.

---

## 🚀 Key Features

### 1. 🕵️‍♂️ Real-Time Fraud Detection
*   **Live Transaction Feed**: Monitors thousands of transactions per second via WebSockets.
*   **PMLA Compliance Engine**: Automatically flags suspicious activities based on Indian laws:
    *   **Structuring (Smurfing)**: Transactions just below ₹50,000.
    *   **High Value (CTR)**: Transactions > ₹10 Lakhs.
    *   **Round Figure Anomalies**: Suspicious exact amounts.
*   **Behavioral Analysis**: Detects Velocity Spikes, New Devices, and Geo-Hopping.

### 2. ⛓️ Immutable Blockchain Ledger
*   **Web3.js Integration**: Every "Block" or "Allow" decision is cryptographically signed using **Ethereum (ECDSA)**.
*   **Tamper-Proof**: Uses SHA-256 hashing to link blocks. If any data is altered in the database, the chain breaks.
*   **Audit Log**: A transparent history of all analyst actions, verifiable by any third party.

### 3. 💾 High-Performance Storage
*   **Hybrid Database**: Uses **NeDB** (MongoDB-compatible) for fast transaction logging and retrieval.
*   **Persistence**: All data is saved locally, ensuring no data loss during restarts.

---

## 🛠️ Tech Stack

*   **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion (Animations).
*   **Backend**: Node.js, Express, WebSocket (Real-time data).
*   **Blockchain**: Web3.js (Ethereum Cryptography), SHA-256 Hashing.
*   **Database**: NeDB (NoSQL).

---

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js installed on your system.

### 1. Backend Setup (The Brain)
Open a terminal and run:
```bash
cd backend
npm install
npm start
```
*Runs on: http://localhost:4000*

### 2. Frontend Setup (The Face)
Open a **new** terminal and run:
```bash
cd frontend
npm install
npm run dev
```
*Runs on: http://localhost:5173*

---

## 🎮 Demo Scenarios (For Judges)

### Scenario 1: The "Money Launderer" Catch
1.  Watch the live feed.
2.  Look for user **`launderer_joe`** attempting a transfer of **`₹49,900`**.
3.  The system flags it as **"PMLA_STRUCTURING_ALERT"**.
4.  Click **"Block Transaction"**.
5.  Open **Audit Log** to show the signed, immutable record.

### Scenario 2: The "Tamper" Detection
1.  Stop the backend server.
2.  Manually edit `backend/data/blockchain.json` and change a "BLOCK" action to "ALLOW".
3.  Restart the server and click **"Verify Integrity"** in the app.
4.  The system will scream **"Validation FAILED"**, proving that the database cannot be hacked silently.

---

## 📂 Project Structure

```
RealtimeGuard/
├── backend/
│   ├── data/               # Database & Blockchain storage
│   ├── blockchain.js       # Core Blockchain & Web3 logic
│   ├── generator.js        # Mock Transaction Generator
│   ├── pmla.js             # Fraud Detection Rules
│   └── server.js           # API & WebSocket Server
├── frontend/
│   ├── src/
│   │   ├── components/     # React UI Components (AuditLog, etc.)
│   │   └── App.jsx         # Main Dashboard
└── README.md
```

---

*Built for Hackathon 2025*