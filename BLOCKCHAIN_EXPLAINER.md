# Blockchain Implementation Guide for Judges

## 1. What is a Blockchain? (Simple Explanation)
Imagine a **digital notebook** shared by everyone, where:
1.  **Pages are glued together**: You can't rip out a page (delete) or change what's written on a previous page (edit) without everyone noticing because the pages are numbered and linked.
2.  **Each page has a unique seal (Hash)**: This seal is calculated based on the content of the page AND the seal of the previous page.
3.  **Tamper-Proof**: If you change even one letter on Page 10, the seal on Page 10 changes. Since Page 11 includes Page 10's seal, Page 11's seal also changes, and so on. The whole chain breaks, alerting everyone that someone tampered with the book.

## 2. What We Implemented: "Immutable Audit Log"
We implemented a **Private Blockchain** to store the **Audit Logs** (the history of actions taken by analysts, like "Blocking a User" or "Flagging a Transaction").

### Why?
In a financial security system, it is critical to prove that **no one tampered with the investigation history**. If an analyst blocks a user, we need a permanent, unchangeable record of that action.

### Technical Details (For the Judges)
We built a custom Blockchain data structure in the backend:

1.  **The Block**: Each action (e.g., "Blocked Transaction #123") is stored in a `Block`.
    *   **Data**: The action details.
    *   **Timestamp**: When it happened.
    *   **Previous Hash**: The digital fingerprint of the *previous* block.
    *   **Hash**: The digital fingerprint of *this* block (calculated using SHA-256).

2.  **The Chain**: These blocks are linked together.
    *   `Block 1` contains the hash of `Genesis Block`.
    *   `Block 2` contains the hash of `Block 1`.
    *   `Block 3` contains the hash of `Block 2`.

3.  **Verification System**:
    *   We have a **"Verify Integrity"** button in the UI.
    *   It recalculates the hashes of every single block from the beginning.
    *   If even one byte of data in the history file (`blockchain.json`) has been changed manually (e.g., by a hacker trying to hide their tracks), the math won't add up, and the system will scream **"INVALID CHAIN"**.

## 3. Talking Points for Your Presentation
*   "We went beyond standard logging and implemented a **Blockchain-backed Audit Trail**."
*   "This ensures **Non-Repudiation**: Once an analyst takes an action, they cannot deny it or delete it later."
*   "We use **SHA-256 Cryptography** to link records, making the history immutable."
*   "This is critical for **Compliance** (like PMLA/GDPR) where data integrity is paramount."
