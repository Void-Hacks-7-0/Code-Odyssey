"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Send, Smartphone } from "lucide-react"
import { UpiModal } from "./upi-modal"
import { CryptoModal } from "./crypto-modal"

interface SendPaymentFormProps {
    onSendSFT: (to: string, amount: string) => Promise<string>;
    onSendUPI: (upiId: string, amount: string, note: string) => Promise<void>;
}

export function SendPaymentForm({ onSendSFT, onSendUPI }: SendPaymentFormProps) {
    const [paymentMode, setPaymentMode] = useState<"sft" | "upi">("sft")
    const [isUpiModalOpen, setIsUpiModalOpen] = useState(false)
    const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false)

    // Form States
    const [recipient, setRecipient] = useState("")
    const [amount, setAmount] = useState("")
    const [note, setNote] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [txHash, setTxHash] = useState("")

    const handlePayment = async () => {
        if (!recipient || !amount) return; // Basic validation

        setIsLoading(true);
        try {
            if (paymentMode === "upi") {
                setIsUpiModalOpen(true);
                // UPI Logic is handled in the modal or after modal confirmation? 
                // User requirement: "Display it inside the existing modal UI... Add a 'Mark as Paid' button"
                // So here we just open the modal. The modal should handle the "Mark as Paid" action which calls onSendUPI.
            } else {
                // SFT Logic
                const hash = await onSendSFT(recipient, amount);
                setTxHash(hash);
                setIsCryptoModalOpen(true);
                // Reset form?
                setRecipient("");
                setAmount("");
                setNote("");
            }
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment failed: " + (error as any).message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Send className="h-5 w-5 text-[#00C2A8]" />
                    Send Payment
                </h2>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-900/50 rounded-xl mb-6 w-fit border border-white/5">
                    <button
                        onClick={() => setPaymentMode("sft")}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${paymentMode === "sft"
                                ? "bg-[#00C2A8] text-black shadow-lg shadow-[#00C2A8]/20"
                                : "text-slate-400 hover:text-white"
                            }`}
                    >
                        Send SFT
                    </button>
                    <button
                        onClick={() => setPaymentMode("upi")}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${paymentMode === "upi"
                                ? "bg-[#00C2A8] text-black shadow-lg shadow-[#00C2A8]/20"
                                : "text-slate-400 hover:text-white"
                            }`}
                    >
                        Send via UPI
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4 max-w-2xl">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">
                            {paymentMode === "sft" ? "Recipient Address" : "UPI ID / Phone Number"}
                        </label>
                        <Input
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder={paymentMode === "sft" ? "0x..." : "user@upi"}
                            className="bg-slate-900/50 border-white/10 focus:border-[#00C2A8] text-white placeholder:text-slate-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Amount</label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="bg-slate-900/50 border-white/10 focus:border-[#00C2A8] text-white placeholder:text-slate-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Note (Optional)</label>
                        <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="What is this for?"
                            className="bg-slate-900/50 border-white/10 focus:border-[#00C2A8] text-white placeholder:text-slate-600 min-h-[80px]"
                        />
                    </div>

                    <Button
                        onClick={handlePayment}
                        disabled={isLoading}
                        className="w-full bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-black font-bold h-12 mt-4 shadow-[0_0_20px_rgba(0,194,168,0.2)] disabled:opacity-50"
                    >
                        {isLoading ? "Processing..." : (paymentMode === "sft" ? (
                            <>
                                Send SFT Tokens
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        ) : (
                            <>
                                Proceed with UPI Payment
                                <Smartphone className="ml-2 h-4 w-4" />
                            </>
                        ))}
                    </Button>
                </div>
            </div>

            <UpiModal
                isOpen={isUpiModalOpen}
                onClose={() => setIsUpiModalOpen(false)}
                upiId={recipient}
                amount={amount}
                note={note}
                onMarkPaid={async () => {
                    await onSendUPI(recipient, amount, note);
                    setIsUpiModalOpen(false);
                    setRecipient("");
                    setAmount("");
                    setNote("");
                }}
            />
            <CryptoModal
                isOpen={isCryptoModalOpen}
                onClose={() => setIsCryptoModalOpen(false)}
                txHash={txHash}
            />
        </>
    )
}
