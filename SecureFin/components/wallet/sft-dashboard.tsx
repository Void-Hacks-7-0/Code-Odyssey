"use client";

import { useState, useEffect } from "react";
import { WalletHeader } from "./wallet-header";
import { TransferForm } from "./transfer-form";
import { TransactionHistory } from "./transaction-history";
import { connectWallet, getSFTBalance, getEthBalance } from "@/src/blockchain/wallet";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Coins } from "lucide-react";

export function SFTDashboard() {
    const [address, setAddress] = useState<string | null>(null);
    const [sftBalance, setSftBalance] = useState("0.00");
    const [ethBalance, setEthBalance] = useState("0.00");
    const [isConnecting, setIsConnecting] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        // Check if already connected
        if (typeof window !== "undefined" && window.ethereum && window.ethereum.selectedAddress) {
            handleConnect();
        }

        // Subscribe to account changes
        const { subscribeToAccountChanges } = require("@/src/blockchain/wallet");
        subscribeToAccountChanges((newAddress: string | null) => {
            setAddress(newAddress);
            if (newAddress) {
                toast.info("Wallet account changed");
            } else {
                toast.info("Wallet disconnected");
            }
        });
    }, []);

    useEffect(() => {
        if (address) {
            updateBalances();
        }
    }, [address, refreshTrigger]);

    async function handleConnect() {
        console.log("Attempting to connect wallet...");
        setIsConnecting(true);
        try {
            const addr = await connectWallet();
            console.log("Wallet connected:", addr);
            setAddress(addr);
            toast.success("Wallet connected successfully!");
        } catch (error: any) {
            console.error("Connection error:", error);
            toast.error("Failed to connect wallet", {
                description: error.message
            });
        } finally {
            setIsConnecting(false);
        }
    }

    async function updateBalances() {
        if (!address) return;
        const sft = await getSFTBalance(address);
        const eth = await getEthBalance(address);
        setSftBalance(sft);
        setEthBalance(eth);
    }

    function handleTransferSuccess() {
        setRefreshTrigger(prev => prev + 1);
        updateBalances();
    }

    return (
        <div className="space-y-6">
            <WalletHeader
                onConnect={handleConnect}
                address={address}
                isConnecting={isConnecting}
            />

            {address && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                    {/* Balance Cards */}
                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-gradient-to-br from-[#00C2A8]/20 to-black border-[#00C2A8]/30">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium">SFT Balance</p>
                                    <h3 className="text-3xl font-bold text-white mt-1">{sftBalance} SFT</h3>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-[#00C2A8]/20 flex items-center justify-center">
                                    <Coins className="h-6 w-6 text-[#00C2A8]" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium">ETH Balance</p>
                                    <h3 className="text-3xl font-bold text-white mt-1">{ethBalance} ETH</h3>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-slate-700/50 flex items-center justify-center">
                                    <div className="h-6 w-6 rounded-full bg-slate-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Actions */}
                    <div className="md:col-span-1">
                        <TransferForm
                            address={address}
                            sftBalance={sftBalance}
                            onTransferSuccess={handleTransferSuccess}
                        />
                    </div>

                    {/* History */}
                    <div className="md:col-span-2">
                        <TransactionHistory address={address} refreshTrigger={refreshTrigger} />
                    </div>
                </div>
            )}

            {!address && (
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 border-dashed">
                    <Coins className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white">Connect your wallet</h3>
                    <p className="text-slate-400 mt-2 max-w-md mx-auto">
                        Connect your MetaMask wallet to view your SFT balance, make transfers, and track your transaction history.
                    </p>
                    <button
                        onClick={handleConnect}
                        className="mt-6 px-6 py-2 bg-[#00C2A8] text-black font-bold rounded-lg hover:bg-[#00C2A8]/90 transition-all"
                    >
                        Connect Now
                    </button>
                </div>
            )}
        </div>
    );
}
