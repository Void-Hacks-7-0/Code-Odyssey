import { Coins, Hexagon } from "lucide-react"

interface BalanceCardsProps {
    sftBalance: string;
    maticBalance: string;
}

export function BalanceCards({ sftBalance, maticBalance }: BalanceCardsProps) {
    return (
        <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
            {/* SFT Balance Card */}
            <div className="bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#00C2A8]/50 transition-colors duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Coins className="h-24 w-24 text-[#00C2A8]" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-slate-400 font-medium mb-2">SFT Balance</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">{sftBalance}</span>
                        <span className="text-[#00C2A8] font-semibold">SFT</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">SecureFin Token</p>
                </div>
            </div>

            {/* MATIC Balance Card */}
            <div className="bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#8247E5]/50 transition-colors duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Hexagon className="h-24 w-24 text-[#8247E5]" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-slate-400 font-medium mb-2">MATIC Balance</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">{maticBalance}</span>
                        <span className="text-[#8247E5] font-semibold">MATIC</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Polygon Network</p>
                </div>
            </div>
        </div>
    )
}
