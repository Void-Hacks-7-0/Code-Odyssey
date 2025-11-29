"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Check, Copy, QrCode } from "lucide-react"

interface UpiModalProps {
    isOpen: boolean
    onClose: () => void
    upiId: string
    amount: string
    note: string
    onMarkPaid: () => void
}

export function UpiModal({ isOpen, onClose, upiId, amount, note, onMarkPaid }: UpiModalProps) {
    const upiLink = `upi://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(note)}`

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-950 border border-[#00C2A8]/30 text-white sm:max-w-md backdrop-blur-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#00C2A8]">UPI Payment (Mock Demo)</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Scan the QR code or use the UPI ID to complete the payment.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6 space-y-6">
                    <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(0,194,168,0.1)]">
                        <QrCode className="h-32 w-32 text-slate-900" />
                    </div>

                    <div className="w-full space-y-2">
                        <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">UPI ID</label>
                        <div className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-lg border border-white/10">
                            <span className="flex-1 font-mono text-sm truncate">{upiId || "merchant@securefin"}</span>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-[#00C2A8] hover:text-[#00C2A8] hover:bg-[#00C2A8]/10">
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="w-full space-y-2">
                        <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Amount</label>
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-white/10">
                            <span className="font-mono text-lg font-bold">₹{amount || "0.00"}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full">
                        <Button variant="outline" className="flex-1 border-[#00C2A8] text-[#00C2A8] hover:bg-[#00C2A8]/10" onClick={() => navigator.clipboard.writeText(upiLink)}>
                            Copy UPI Link
                        </Button>
                        <Button onClick={onMarkPaid} className="flex-1 bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-black font-bold">
                            <Check className="mr-2 h-4 w-4" />
                            Mark as Paid
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
