"use client"

import { Shield, Zap, Lock, Globe } from "lucide-react"

export function AboutSection() {
    const features = [
        {
            icon: <Globe className="h-6 w-6 text-[#00C2A8]" />,
            title: "Blockchain Transparency",
            description: "Every transaction is recorded on an immutable ledger, ensuring complete visibility and trust.",
        },
        {
            icon: <Zap className="h-6 w-6 text-[#00C2A8]" />,
            title: "Smart Financial Insights",
            description: "AI-driven analytics provide real-time recommendations to optimize your financial growth.",
        },
        {
            icon: <Lock className="h-6 w-6 text-[#00C2A8]" />,
            title: "Real-time Fraud Detection",
            description: "Advanced algorithms monitor and block suspicious activities instantly to keep your assets safe.",
        },
        {
            icon: <Shield className="h-6 w-6 text-[#00C2A8]" />,
            title: "Inclusive & Accessible",
            description: "Designed for everyone, everywhere. Banking without borders or barriers.",
        },
    ]

    return (
        <section className="relative w-full py-24 bg-black overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00C2A8]/5 via-black to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="container relative px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                        About <span className="text-[#00C2A8]">SecureFin</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-light">
                        Building the infrastructure for a decentralized, transparent, and secure financial future.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-[#00C2A8]/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(0,194,168,0.3)]"
                        >
                            <div className="mb-4 p-3 rounded-xl bg-white/5 w-fit group-hover:bg-[#00C2A8]/10 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#00C2A8] transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-2xl md:text-3xl font-medium text-white tracking-tight">
                        Built for the future of <span className="text-[#00C2A8]">secure, fearless transactions.</span>
                    </p>
                </div>
            </div>
        </section>
    )
}
