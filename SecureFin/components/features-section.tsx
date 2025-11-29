"use client"
import RadialOrbitalTimeline from "./radial-orbital-timeline"
import { Globe, Zap, Shield, TrendingUp, Wallet, BarChart3 } from "lucide-react"

export function FeaturesSection() {
  const timelineData = [
    {
      id: 1,
      title: "Global Reach",
      date: "2024",
      content: "Connect to payment networks in 180+ countries with local payment methods",
      category: "payments",
      icon: Globe,
      relatedIds: [2, 3],
      status: "completed" as const,
      energy: 95,
    },
    {
      id: 2,
      title: "Lightning Fast",
      date: "2024",
      content: "Process transactions in milliseconds with our optimized infrastructure",
      category: "performance",
      icon: Zap,
      relatedIds: [1, 4],
      status: "completed" as const,
      energy: 92,
    },
    {
      id: 3,
      title: "Enterprise Security",
      date: "2024",
      content: "Bank-grade encryption and compliance with international standards",
      category: "security",
      icon: Shield,
      relatedIds: [1, 5],
      status: "completed" as const,
      energy: 98,
    },
    {
      id: 4,
      title: "Real-time Detection",
      date: "2024",
      content: "Monitor transactions and get insights with advanced reporting tools",
      category: "analytics",
      icon: BarChart3,
      relatedIds: [2, 6],
      status: "in-progress" as const,
      energy: 85,
    },
    {
      id: 5,
      title: "Smart Wallets",
      date: "2025",
      content: "Manage multiple currencies and digital assets seamlessly",
      category: "wallets",
      icon: Wallet,
      relatedIds: [3],
      status: "pending" as const,
      energy: 78,
    },
    {
      id: 6,
      title: "API Integration",
      date: "2025",
      content: "Powerful APIs for building custom financial applications",
      category: "integration",
      icon: TrendingUp,
      relatedIds: [4],
      status: "pending" as const,
      energy: 72,
    },
  ]

  return (
    <section className="w-full py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Powerful Features for Modern Finance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Click on any node to explore our interconnected fintech features
          </p>
        </div>

        <RadialOrbitalTimeline timelineData={timelineData} />
      </div>
    </section>
  )
}
