import { AboutSection } from "@/components/about-section"
import { Navbar } from "@/components/navbar"

export default function AboutPage() {
    return (
        <main className="bg-background text-foreground pt-16">
            <Navbar />
            <AboutSection />
        </main>
    )
}
