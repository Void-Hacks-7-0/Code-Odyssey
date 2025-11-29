import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero with 3D Globe */}
      <HeroSection />


      {/* Features Section */}
      <FeaturesSection />
    </main>
  )
}
