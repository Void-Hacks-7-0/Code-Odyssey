import requests
import time
import random
import json
import csv

# Configuration
API_URL = "http://localhost:4000/api/transaction"
DELAY_SECONDS = 0.5  # Delay between requests to simulate a stream

def send_transaction(data):
    try:
        response = requests.post(API_URL, json=data)
        if response.status_code == 200:
            print(f"[SUCCESS] Sent {data.get('merchant')} - ${data.get('amount')}")
        else:
            print(f"[ERROR] Failed: {response.text}")
    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")

def load_mock_data():
    """Generates random data if no file is provided"""
    merchants = ["Uber", "Amazon", "Netflix", "Starbucks", "Apple"]
    while True:
        data = {
            "amount": round(random.uniform(10, 1000), 2),
            "merchant": random.choice(merchants),
            "fraud_score": random.randint(0, 100),
            "location": "Simulated, PY"
        }
        send_transaction(data)
        time.sleep(DELAY_SECONDS)

if __name__ == "__main__":
    print("Starting Bulk Data Loader...")
    print(f"Target: {API_URL}")
    print("Reading from: scripts/transactions.csv")
    print("Press Ctrl+C to stop.")
    
    try:
        with open('scripts/transactions.csv', 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Convert types
                row['amount'] = float(row['amount'])
                row['fraud_score'] = int(row['fraud_score'])
                
                send_transaction(row)
                time.sleep(DELAY_SECONDS)
        print("Done loading CSV.")
    except FileNotFoundError:
        print("Error: scripts/transactions.csv not found. Generating random data instead...")
        load_mock_data()
