# RealtimeGuard - Fraud Operations Center

**RealtimeGuard** is a real-time fraud detection engine that analyzes transactions in under 200ms. This repository contains the **Live Operations Dashboard** and a **Transaction Simulator** for demonstration purposes.

## How this implements the RealtimeGuard Solution

| RealtimeGuard Feature | Current Implementation |
|-----------------------|------------------------|
| **Real-time Analysis (<200ms)** | **WebSocket Stream**: The backend pushes transactions to the UI instantly via WebSockets (`ws://localhost:4000`), achieving sub-200ms visualization latency. |
| **Unified Scoring Engine** | **Risk Gauge**: The UI displays a `fraud_score` (0-100%) for every transaction, color-coded (Green/Amber/Red) for immediate risk assessment. |
| **Explainability** | **Explainability Panel**: When a transaction is selected, the panel shows *why* it was flagged (e.g., "Velocity Spike", "Geo Mismatch"), fulfilling the transparency requirement. |
| **Account Takeover Detection** | **Geo-Jump Map**: The map draws lines between consecutive transactions from the same user. Long lines in short timeframes visually flag "impossible travel" or account takeovers. |
| **Analyst Feedback Loop** | **Feedback Buttons**: The "Confirm Fraud" / "False Positive" buttons send data back to the server (`POST /api/action`), simulating the continuous improvement loop. |
| **High-Volume Monitoring** | **Live Feed & Ticker**: The scrolling feed and stats ticker demonstrate the system's ability to handle and visualize high-velocity transaction streams. |

## Project Structure
- **Frontend (`/frontend`)**: React + Vite + Tailwind CSS. The "Cyberpunk" dashboard for Fraud Analysts.
- **Backend (`/backend`)**: Node.js. Simulates the "Transaction Stream" and "Fraud Engine" (generating mock transactions with risk scores).

## Running the Project
1. **Backend**: `cd backend && npm start` (Runs on Port 4000)

## External Data Ingestion
You can inject your own transaction data (from Python, CSV, etc.) using the API:

### POST /api/transaction
**URL**: `http://localhost:4000/api/transaction`
**Headers**: `Content-Type: application/json`
**Body**:
```json
{
  "amount": 5000,
  "merchant": "Suspicious Store",
  "fraud_score": 95,
  "location": "Unknown, XX"
# RealtimeGuard - Fraud Operations Center

**RealtimeGuard** is a real-time fraud detection engine that analyzes transactions in under 200ms. This repository contains the **Live Operations Dashboard** and a **Transaction Simulator** for demonstration purposes.

## How this implements the RealtimeGuard Solution

| RealtimeGuard Feature | Current Implementation |
|-----------------------|------------------------|
| **Real-time Analysis (<200ms)** | **WebSocket Stream**: The backend pushes transactions to the UI instantly via WebSockets (`ws://localhost:4000`), achieving sub-200ms visualization latency. |
| **Unified Scoring Engine** | **Risk Gauge**: The UI displays a `fraud_score` (0-100%) for every transaction, color-coded (Green/Amber/Red) for immediate risk assessment. |
| **Explainability** | **Explainability Panel**: When a transaction is selected, the panel shows *why* it was flagged (e.g., "Velocity Spike", "Geo Mismatch"), fulfilling the transparency requirement. |
| **Account Takeover Detection** | **Geo-Jump Map**: The map draws lines between consecutive transactions from the same user. Long lines in short timeframes visually flag "impossible travel" or account takeovers. |
| **Analyst Feedback Loop** | **Feedback Buttons**: The "Confirm Fraud" / "False Positive" buttons send data back to the server (`POST /api/action`), simulating the continuous improvement loop. |
| **High-Volume Monitoring** | **Live Feed & Ticker**: The scrolling feed and stats ticker demonstrate the system's ability to handle and visualize high-velocity transaction streams. |

## Project Structure
- **Frontend (`/frontend`)**: React + Vite + Tailwind CSS. The "Cyberpunk" dashboard for Fraud Analysts.
- **Backend (`/backend`)**: Node.js. Simulates the "Transaction Stream" and "Fraud Engine" (generating mock transactions with risk scores).

## Running the Project
1. **Backend**: `cd backend && npm start` (Runs on Port 4000)

## External Data Ingestion
You can inject your own transaction data (from Python, CSV, etc.) using the API:

### POST /api/transaction
**URL**: `http://localhost:4000/api/transaction`
**Headers**: `Content-Type: application/json`
**Body**:
```json
{
  "amount": 5000,
  "merchant": "Suspicious Store",
  "fraud_score": 95,
  "location": "Unknown, XX"
}
```
**Example (cURL)**:
```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"amount": 999, "merchant": "Test", "fraud_score": 10}' \
     http://localhost:4000/api/transaction
```

## Slack Integration
To receive real-time alerts in Slack when an analyst blocks a transaction:
1.  Create a **Slack App** and enable **Incoming Webhooks**.
2.  Copy the Webhook URL (e.g., `https://hooks.slack.com/services/...`).
3.  Open `backend/.env`.
4.  Add this line:
    ```
    SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
    ```
5.  Restart the backend (`npm start`).