import { Shield, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FinancialLiteracyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg tracking-tight">Vitt Raksha</span>
                    </Link>
                    <Button variant="ghost" size="sm" asChild className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                    </Button>
                </div>
            </header>
            <main className="flex-1 container px-4 md:px-6 py-12">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Financial Literacy</h1>
                    <p className="text-xl text-muted-foreground">
                        Empowering you with the knowledge to make secure and smart financial decisions.
                    </p>
                    <div className="p-8 rounded-2xl bg-card border border-border mt-8">
                        <p className="text-lg font-medium">Coming Soon</p>
                        <p className="text-muted-foreground mt-2">
                            We are curating the best resources to help you master your finances. Stay tuned!
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
