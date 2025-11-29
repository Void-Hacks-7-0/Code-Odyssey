import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'transactions.json');

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address');

        if (!fs.existsSync(DATA_FILE)) {
            return NextResponse.json({ transactions: [] });
        }

        const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
        const transactions = JSON.parse(fileData);

        if (address) {
            const filtered = transactions.filter((tx: any) =>
                tx.from.toLowerCase() === address.toLowerCase() ||
                tx.to.toLowerCase() === address.toLowerCase()
            );
            return NextResponse.json({ transactions: filtered });
        }

        return NextResponse.json({ transactions });
    } catch (error) {
        console.error('Error fetching history:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
