# RealtimeGuard: Judges Presentation & Q&A Prep

## 🚀 The Pitch (What to say)

**"Good morning/afternoon. We are Team [Your Team Name], and we present RealtimeGuard."**

### 1. The Problem
"In the world of digital finance, fraud is happening in milliseconds. Traditional systems are too slow, and worse, they often lack transparency. If an analyst blocks a user, how do we know that decision wasn't tampered with later?"

### 2. The Solution
"RealtimeGuard is a **Next-Gen Fraud Detection System** that focuses on three pillars: **Speed, Explainability, and Integrity**."

### 3. Key Features (The "Wow" Factors)
*   **Real-Time Monitoring**: "We process transactions instantly, visualizing them on a live map and feed."
*   **PMLA Compliance**: "Our engine automatically detects money laundering patterns like 'Smurfing' (structuring small transactions) and high-value transfers."
*   **Blockchain-Backed Audit Log**: "This is our unique innovation. Every action taken by our security analysts is recorded on a **private, immutable blockchain**. This ensures that our audit trails are tamper-proof. We don't just *log* actions; we *seal* them cryptographically."

---

## 🧠 Q&A: Hard to Easy

### 🔴 HARD Questions (Technical & Architecture)

**Q1: "Why did you build a custom blockchain instead of using Hyperledger or Ethereum?"**
*   **Answer**: "Great question. Public chains like Ethereum have gas fees and latency (12-15 seconds per block), which is too slow for a high-frequency trading environment. Hyperledger is powerful but heavy. We built a **lightweight, purpose-built private chain** in Node.js. It gives us the **integrity** we need (SHA-256 hashing) without the **overhead** of a distributed consensus algorithm like Proof-of-Work. It's optimized for speed and internal compliance."

**Q2: "What happens if the server crashes? Is the blockchain lost?"**
*   **Answer**: "No. The blockchain is persisted to disk (`blockchain.json`). When the server restarts, it reloads the chain and immediately validates the hashes to ensure no corruption occurred while it was down."

**Q3: "How do you handle 'collisions' in your hash function?"**
*   **Answer**: "We use **SHA-256**, which is the industry standard used by Bitcoin. The probability of a collision is astronomically low ($1$ in $2^{256}$), effectively zero for our use case."

### 🟡 MEDIUM Questions (Logic & Features)

**Q4: "How does your PMLA (Prevention of Money Laundering Act) detection work?"**
*   **Answer**: "We implemented specific rules based on Indian regulations. For example, we flag **'Structuring'**—transactions just below the 50k reporting limit (e.g., 49,000 INR)—and **Round Number Anomalies**, which are common in laundering schemes."

**Q5: "Can an analyst delete a log if they made a mistake?"**
*   **Answer**: "No, and that's by design. In a secure audit system, you never 'delete'. If a mistake is made, the analyst must create a *new* entry correcting it (e.g., 'Unblocking User'). Both the mistake and the correction remain in the chain forever, preserving the full history."

### 🟢 EASY Questions (General)

**Q6: "What tech stack did you use?"**
*   **Answer**: "We used **React and Vite** for a high-performance Frontend, **Node.js and Express** for the Backend, and **SQLite** for transaction storage. The Blockchain engine is custom-written in **JavaScript**."

**Q7: "What do the red and green colors mean on the dashboard?"**
*   **Answer**: "Red indicates a **Blocked** or **High Risk** transaction (Fraud Score > 80). Green indicates a **Safe** or **Verified** transaction."
