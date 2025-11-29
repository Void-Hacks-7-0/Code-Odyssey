import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'transactions.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// Initialize file if not exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { txHash, from, to, amount, timestamp } = body;

        if (!txHash || !from || !to || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newTx = {
            txHash,
            from,
            to,
            amount,
            timestamp: timestamp || new Date().toISOString(),
            status: 'Confirmed' // In a real app, we would verify this on-chain
        };

        const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
        const transactions = JSON.parse(fileData);

        transactions.unshift(newTx); // Add to beginning

        fs.writeFileSync(DATA_FILE, JSON.stringify(transactions, null, 2));

        return NextResponse.json({ success: true, transaction: newTx });
    } catch (error) {
        console.error('Error logging transaction:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
