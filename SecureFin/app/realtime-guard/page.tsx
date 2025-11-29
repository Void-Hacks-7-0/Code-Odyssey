"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Shield, Activity, Lock, AlertTriangle, Eye, Server, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RealtimeGuardPage() {
    const { role } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (role !== "admin") {
            router.push("/dashboard")
        }
    }, [role, router])

    if (role !== "admin") {
        return null // Or a loading spinner while redirecting
    }

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

            <header className="border-b border-green-900/50 bg-black/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 animate-pulse" />
                        <span className="font-bold text-lg tracking-widest uppercase">RealtimeGuard <span className="text-xs bg-green-900 text-green-100 px-1 rounded">BETA</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs text-green-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                            SYSTEM ONLINE
                        </div>
                        <Button variant="ghost" size="sm" asChild className="gap-2 text-green-500 hover:text-green-400 hover:bg-green-900/20">
                            <Link href="/">
                                <Home className="h-4 w-4" />
                                Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container px-4 md:px-6 py-8 space-y-8 relative z-10">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-black/50 border border-green-900 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm uppercase text-green-700">Threat Level</h3>
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="text-2xl font-bold text-yellow-500">MODERATE</div>
                    </div>
                    <div className="bg-black/50 border border-green-900 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm uppercase text-green-700">Active Scans</h3>
                            <Activity className="h-4 w-4" />
                        </div>
                        <div className="text-2xl font-bold">1,240/s</div>
                    </div>
                    <div className="bg-black/50 border border-green-900 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm uppercase text-green-700">Threats Blocked</h3>
                            <Shield className="h-4 w-4" />
                        </div>
                        <div className="text-2xl font-bold">42</div>
                    </div>
                    <div className="bg-black/50 border border-green-900 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm uppercase text-green-700">System Load</h3>
                            <Server className="h-4 w-4" />
                        </div>
                        <div className="text-2xl font-bold">12%</div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3 h-[500px]">
                    <div className="md:col-span-2 bg-black/50 border border-green-900 rounded-lg p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('/world-map.png')] opacity-10 bg-center bg-no-repeat bg-contain" />
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            Live Transaction Monitoring
                        </h3>
                        <div className="space-y-2 font-mono text-xs h-full overflow-hidden">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="flex justify-between border-b border-green-900/30 pb-1 opacity-70 hover:opacity-100 transition-opacity">
                                    <span>TXN-{Math.random().toString(36).substring(7).toUpperCase()}</span>
                                    <span className="text-green-300">VERIFIED</span>
                                    <span>{Math.floor(Math.random() * 100)}ms</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-black/50 border border-green-900 rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Security Logs
                        </h3>
                        <div className="space-y-4 text-xs">
                            <div className="p-2 bg-red-900/20 border border-red-900/50 rounded">
                                <span className="text-red-500 font-bold">[ALERT]</span> IP 192.168.1.X blocked due to multiple failed attempts.
                            </div>
                            <div className="p-2 bg-green-900/20 border border-green-900/50 rounded">
                                <span className="text-green-500 font-bold">[INFO]</span> System patch applied successfully.
                            </div>
                            <div className="p-2 bg-green-900/20 border border-green-900/50 rounded">
                                <span className="text-green-500 font-bold">[INFO]</span> Database backup completed.
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
