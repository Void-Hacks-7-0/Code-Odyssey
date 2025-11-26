# RealtimeGuard - Hackathon Demo Guide

Follow this script to give a winning presentation.

## 1. The Hook (Problem)
*Start with the Dashboard open on the screen.*
> "Fraud moves fast. Traditional systems take minutes to flag a transaction. By then, the money is gone. We built RealtimeGuard to stop fraud in **milliseconds**."

## 2. The Solution (Live Demo)
### A. The Live Stream
*Point to the scrolling Live Feed.*
> "This is our Live Operations Center. It ingests thousands of transactions per second via WebSockets. Green is safe, Red is fraud."

### B. The "Real-Time" Proof
*Run the Python script or the cURL command to inject a specific transaction.*
```bash
python scripts/load_data.py
# OR
curl -X POST -H "Content-Type: application/json" -d '{"amount": 9999, "merchant": "LIVE DEMO", "fraud_score": 99}' http://localhost:4000/api/transaction
```
> "I'm going to inject a live transaction right now... Boom. It appears instantly. <200ms latency."

### C. The Intelligence (Explainability)
*Click on the Red transaction you just injected.*
> "Why was this flagged? Our ML engine gave it a 99% risk score. The Explainability Panel shows exactly why: 'Velocity Spike' and 'Geo-Mismatch'."

### D. The Map (Account Takeover)
*Point to the Map lines.*
> "See these lines? This user just transacted in London, and 5 minutes later in Lagos. That's physically impossible. Our system flagged this 'Geo-Jump' automatically."

## 3. The Feedback Loop
*Click the 'Confirm Fraud' button.*
> "The analyst confirms the fraud here. This feedback is sent back to the server to retrain our models, making RealtimeGuard smarter with every attack."

## 4. Closing
> "RealtimeGuard is fast, transparent, and self-improving. It's the future of fraud prevention."
