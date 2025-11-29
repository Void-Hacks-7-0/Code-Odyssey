"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { getShortAddress } from "@/src/blockchain/wallet";

interface Transaction {
    txHash: string;
    from: string;
    to: string;
    amount: string;
    timestamp: string;
    status: string;
}

interface TransactionHistoryProps {
    address: string | null;
    refreshTrigger: number;
}

export function TransactionHistory({ address, refreshTrigger }: TransactionHistoryProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (address) {
            fetchHistory();
        }
    }, [address, refreshTrigger]);

    async function fetchHistory() {
        setLoading(true);
        try {
            const res = await fetch(`/api/history?address=${address}`);
            const data = await res.json();
            if (data.transactions) {
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoading(false);
        }
    }

    if (!address) return null;

    return (
        <Card className="bg-black/40 border-[#00C2A8]/20 backdrop-blur-sm h-full">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <History className="h-5 w-5 text-[#00C2A8]" />
                    Transaction History
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                        <p className="text-slate-400 text-center py-4">Loading history...</p>
                    ) : transactions.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">No transactions found</p>
                    ) : (
                        transactions.map((tx) => {
                            const isIncoming = tx.to.toLowerCase() === address.toLowerCase();
                            return (
                                <div key={tx.txHash} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#00C2A8]/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${isIncoming ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {isIncoming ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {isIncoming ? 'Received from' : 'Sent to'} {isIncoming ? getShortAddress(tx.from) : getShortAddress(tx.to)}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(tx.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${isIncoming ? 'text-green-400' : 'text-white'}`}>
                                            {isIncoming ? '+' : '-'}{tx.amount} SFT
                                        </p>
                                        <p className="text-xs text-[#00C2A8]">
                                            {tx.status}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
