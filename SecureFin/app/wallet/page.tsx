"use client"

import { Navbar } from "@/components/navbar"
import { SFTDashboard } from "@/components/wallet/sft-dashboard"

export default function WalletPage() {
    return (
        <div className="min-h-screen bg-[#0B0F10] text-white selection:bg-[#00C2A8]/30">
            <Navbar />

            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#00C2A8]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#8247E5]/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <main className="relative z-10 container mx-auto px-4 pt-24 pb-12 max-w-6xl">
                <SFTDashboard />
            </main>
        </div>
    )
}
