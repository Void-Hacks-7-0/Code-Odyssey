import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fromWallet, upiId, amount, note } = body;

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, this would integrate with a payment gateway
        console.log(`Processing UPI payment: ${amount} to ${upiId} from ${fromWallet} (${note})`);

        return NextResponse.json({
            success: true,
            message: "Payment processed successfully",
            transactionId: "UPI-" + Date.now()
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }
}
