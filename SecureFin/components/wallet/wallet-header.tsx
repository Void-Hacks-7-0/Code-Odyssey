import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

interface WalletHeaderProps {
    onConnect: () => void;
    address: string | null;
    isConnecting?: boolean;
}

export function WalletHeader({ onConnect, address, isConnecting }: WalletHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Wallet className="h-8 w-8 text-[#00C2A8]" />
                    Secure Wallet
                </h1>
                <p className="text-slate-400 mt-1">Manage your SFT tokens, micro-payments, and UPI transactions securely.</p>
            </div>
            <Button
                onClick={onConnect}
                disabled={isConnecting || !!address}
                className="bg-transparent border border-[#00C2A8] text-[#00C2A8] hover:bg-[#00C2A8]/10 shadow-[0_0_15px_rgba(0,194,168,0.3)] transition-all duration-300 disabled:opacity-50"
            >
                {address
                    ? `${address.slice(0, 6)}...${address.slice(-4)}`
                    : (isConnecting ? "Connecting..." : "Connect Wallet")
                }
            </Button>
        </div>
    )
}
