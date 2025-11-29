"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface CryptoModalProps {
    isOpen: boolean
    onClose: () => void
    txHash?: string
}

export function CryptoModal({ isOpen, onClose, txHash }: CryptoModalProps) {
    const [status, setStatus] = useState<"pending" | "success">("pending")

    useEffect(() => {
        if (isOpen) {
            // If we have a hash, we assume it's sent. 
            // In a real app we might wait for confirmations here, but for now we simulate a "processing" UI then success.
            setStatus("pending")
            const timer = setTimeout(() => setStatus("success"), 2000)
            return () => clearTimeout(timer)
        }
    }, [isOpen, txHash])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-950 border border-[#00C2A8]/30 text-white sm:max-w-md backdrop-blur-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#00C2A8] text-center">
                        {status === "pending" ? "Processing Transaction" : "Transaction Sent"}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-8 space-y-6">
                    {status === "pending" ? (
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#00C2A8] blur-xl opacity-20 animate-pulse rounded-full" />
                            <Loader2 className="h-16 w-16 text-[#00C2A8] animate-spin relative z-10" />
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#00C2A8] blur-xl opacity-20 rounded-full" />
                            <CheckCircle2 className="h-16 w-16 text-[#00C2A8] relative z-10" />
                        </div>
                    )}

                    <div className="text-center space-y-2">
                        <p className="text-slate-300">
                            {status === "pending"
                                ? "Please wait while we confirm your transaction on the blockchain..."
                                : "Your SFT tokens have been successfully transferred."}
                        </p>
                        {status === "success" && txHash && (
                            <div className="bg-slate-900/50 p-3 rounded-lg border border-white/10 mt-4">
                                <p className="text-xs text-slate-500 uppercase mb-1">Transaction Hash</p>
                                <div className="flex items-center gap-2 justify-center">
                                    <span className="font-mono text-xs text-[#00C2A8]">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                                    <a href={`https://amoy.polygonscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-3 w-3 text-slate-500 hover:text-white" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {status === "success" && (
                        <Button onClick={onClose} className="w-full bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-black font-bold">
                            Close
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
