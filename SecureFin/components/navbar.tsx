"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Shield, Menu, ArrowLeft, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const { isLoggedIn, role, logout } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const isHome = pathname === "/"

    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-6">
                    {/* Back Button (only if not on home) */}
                    {!isHome && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="mr-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}

                    <Link href="/" className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-cyan-500" />
                        <span className="font-bold text-lg tracking-tight text-foreground">
                            SecureFin
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-6 ml-6">
                        <Link href="/about" className={cn("text-sm font-medium transition-colors hover:text-cyan-400", pathname === "/about" ? "text-cyan-400" : "text-muted-foreground")}>
                            About
                        </Link>
                        {isLoggedIn && (
                            <>
                                <Link href="/dashboard" className={cn("text-sm font-medium transition-colors hover:text-cyan-400", pathname === "/dashboard" ? "text-cyan-400" : "text-muted-foreground")}>
                                    Dashboard
                                </Link>
                                {role !== 'admin' && (
                                    <>
                                        <Link href="/vitta-raksha" className={cn("text-sm font-medium transition-colors hover:text-cyan-400", pathname === "/vitta-raksha" ? "text-cyan-400" : "text-muted-foreground")}>
                                            Vitt Raksha
                                        </Link>
                                        <Link href="/optibudget" className={cn("text-sm font-medium transition-colors hover:text-cyan-400", pathname === "/optibudget" ? "text-cyan-400" : "text-muted-foreground")}>
                                            OptiBudget
                                        </Link>
                                    </>
                                )}
                                {role === 'admin' && (
                                    <Link href="/realtime-guard" className={cn("text-sm font-medium transition-colors hover:text-cyan-400", pathname === "/realtime-guard" ? "text-cyan-400" : "text-muted-foreground")}>
                                        RealtimeGuard
                                    </Link>
                                )}
                                <Link href="/wallet" className={cn("text-sm font-medium transition-colors hover:text-cyan-400", pathname === "/wallet" ? "text-cyan-400" : "text-muted-foreground")}>
                                    Wallet
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-3">
                        {isLoggedIn ? (
                            <Button variant="ghost" onClick={logout} className="gap-2 hover:bg-red-500/10 hover:text-red-500 transition-colors">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        ) : (
                            <Link href="/">
                                <Button variant="outline" className="border-cyan-500/20 hover:bg-cyan-500/10 text-cyan-500">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden relative">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-muted-foreground hover:text-foreground">
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Mobile Dropdown */}
                        {isMobileMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-56 p-2 bg-card border border-border rounded-xl shadow-lg z-50">
                                <nav className="flex flex-col space-y-1">
                                    <Link href="/about" className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg">About</Link>
                                    {isLoggedIn && (
                                        <>
                                            <Link href="/dashboard" className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg">Dashboard</Link>
                                            {role !== 'admin' && (
                                                <>
                                                    <Link href="/vitta-raksha" className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg">Vitt Raksha</Link>
                                                    <Link href="/optibudget" className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg">OptiBudget</Link>
                                                </>
                                            )}
                                            {role === 'admin' && (
                                                <Link href="/realtime-guard" className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg">RealtimeGuard</Link>
                                            )}
                                            <Link href="/wallet" className="px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg">Wallet</Link>
                                        </>
                                    )}
                                    <div className="border-t border-border my-2 pt-2">
                                        {isLoggedIn ? (
                                            <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2">
                                                <LogOut className="h-4 w-4" /> Logout
                                            </button>
                                        ) : (
                                            <Link href="/" className="block w-full text-center px-3 py-2 text-sm bg-cyan-500/10 text-cyan-500 rounded-lg">
                                                Login
                                            </Link>
                                        )}
                                    </div>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
