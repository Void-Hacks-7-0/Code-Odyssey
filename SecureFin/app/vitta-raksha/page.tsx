"use client";

import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Shield, Play, AlertTriangle, CheckCircle, HelpCircle, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Mock Data
const caseStudies = [
    {
        id: 1,
        title: "The Phishing Email Scam",
        category: "Scam",
        image: "/placeholder.svg", // Replace with real image if available
        description: "How a student almost lost their account to a fake email.",
        fullStory: "Rohan received an email claiming his bank account was locked. It looked official, with the bank's logo. He clicked the link and entered his password...",
        risks: ["Unsolicited link", "Urgency tactic", "Fake login page"],
        protection: ["Verify sender email", "Call the bank directly", "Enable 2FA"],
        outcome: "Rohan realized the URL was wrong just in time and changed his password immediately."
    },
    {
        id: 2,
        title: "The Free Gift Card Trap",
        category: "Scam",
        image: "/placeholder.svg",
        description: "Too good to be true offers that steal your data.",
        fullStory: "Sarah saw an Instagram ad for a free ₹5000 Amazon gift card. She filled out a survey asking for her address and phone number...",
        risks: ["Data harvesting", "Identity theft potential", "Spam targeting"],
        protection: ["If it's free, you are the product", "Check official pages", "Never share personal info"],
        outcome: "She started receiving spam calls but blocked them and learned to ignore such ads."
    }
];

const scamVideos = [
    { id: "1", title: "Love & Romance Scams", embedUrl: "https://www.youtube.com/embed/Csp9fce96J4" },
    { id: "2", title: "Fear & Intimidation Tactics", embedUrl: "https://www.youtube.com/embed/7Hs8S8ZboWs" },
    { id: "3", title: "Online Shopping Frauds", embedUrl: "https://www.youtube.com/embed/M53S6RaEQbo" },
    { id: "4", title: "Sextortion & Lust Scams", embedUrl: "https://www.youtube.com/embed/GEUBU1ETzBs" }
];

function VideoCard({ video }: { video: typeof scamVideos[0] }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoId = video.embedUrl.split("/embed/")[1];
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    if (isPlaying) {
        return (
            <div className="aspect-[4/3] bg-zinc-800 rounded-lg overflow-hidden">
                <iframe
                    width="100%"
                    height="100%"
                    src={`${video.embedUrl}?autoplay=1`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        );
    }

    return (
        <div
            className="aspect-[4/3] bg-zinc-800 rounded-lg flex items-center justify-center relative group cursor-pointer overflow-hidden"
            onClick={() => setIsPlaying(true)}
        >
            <img
                src={thumbnailUrl}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
            <Play className="h-12 w-12 text-white opacity-90 group-hover:scale-110 transition-transform z-10" />
        </div>
    );
}

const quizQuestions = [
    {
        question: "You receive an email from 'Netflix' asking to update your payment info via a link. What do you do?",
        options: ["Click the link and update", "Reply asking if it's real", "Log in to Netflix directly via app/browser", "Ignore it"],
        correct: 2,
        explanation: "Always go to the source directly. Never click links in unexpected emails."
    },
    {
        question: "What is 2-Factor Authentication (2FA)?",
        options: ["Two passwords", "A password and a code sent to your phone", "A backup email", "A complex password"],
        correct: 1,
        explanation: "2FA adds a second layer of security, usually a code sent to your device."
    }
];

export default function VittaRakshaPage() {
    // Modal State
    const [selectedCase, setSelectedCase] = useState<typeof caseStudies[0] | null>(null);

    // Video AI State
    const [videoSummaries, setVideoSummaries] = useState<{ [key: string]: string }>({});
    const [loadingVideo, setLoadingVideo] = useState<string | null>(null);

    // Quiz State
    const [quizOpen, setQuizOpen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

    // Handlers
    async function handleVideoSummary(id: string, title: string) {
        if (videoSummaries[id]) return; // Already fetched
        setLoadingVideo(id);
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: `Summarize the key safety takeaways for a video titled "${title}". Keep it under 50 words.` }),
            });
            const data = await res.json();
            setVideoSummaries(prev => ({ ...prev, [id]: data.text }));
        } catch (error) {
            toast.error("Failed to get summary");
        } finally {
            setLoadingVideo(null);
        }
    }

    const handleQuizAnswer = (index: number) => {
        const correct = quizQuestions[currentQuestion].correct === index;
        if (correct) setScore(s => s + 1);

        setQuizFeedback(correct ? "Correct! ✅" : "Incorrect ❌");

        setTimeout(() => {
            setQuizFeedback(null);
            if (currentQuestion < quizQuestions.length - 1) {
                setCurrentQuestion(c => c + 1);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    const resetQuiz = () => {
        setScore(0);
        setCurrentQuestion(0);
        setShowResult(false);
        setQuizOpen(false);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Header Content (now part of main with padding) */}
            <div className="pt-24 pb-12 text-center border-b border-zinc-800 bg-zinc-900/50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Shield className="h-10 w-10 text-green-500" />
                        <h1 className="text-4xl font-bold">Vitta Raksha</h1>
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2">Financial Literacy</h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Empowering you with the knowledge to make secure and smart financial decisions.
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-4 py-12 space-y-16">

                {/* Section 1: Case Studies */}
                <section>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        Real-World Case Studies
                        <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400 font-normal">Learn from real situations</span>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {caseStudies.map(study => (
                            <Card
                                key={study.id}
                                className="bg-zinc-900 border-zinc-800 hover:border-green-500/50 transition-all cursor-pointer group"
                                onClick={() => setSelectedCase(study)}
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">{study.category}</span>
                                    </div>
                                    <CardTitle className="text-white group-hover:text-green-400 transition-colors">{study.title}</CardTitle>
                                    <CardDescription className="text-zinc-400">{study.description}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button variant="link" className="text-green-500 p-0 h-auto">Read Full Story &rarr;</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Section 2: Scam Awareness Videos */}
                <section>
                    <h3 className="text-2xl font-bold mb-6 flex items-center justify-between">
                        Scam Awareness Videos
                        <Play className="h-5 w-5 text-green-500" />
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {scamVideos.map(video => (
                            <div key={video.id} className="space-y-3">
                                <VideoCard video={video} />
                                <div>
                                    <h4 className="font-medium text-sm text-zinc-200 line-clamp-2">{video.title}</h4>
                                    <div className="mt-2">
                                        {!videoSummaries[video.id] ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-xs border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                                                onClick={() => handleVideoSummary(video.id, video.title)}
                                                disabled={loadingVideo === video.id}
                                            >
                                                {loadingVideo === video.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                                                Get AI Summary
                                            </Button>
                                        ) : (
                                            <div className="bg-green-900/20 border border-green-900/50 p-3 rounded text-xs text-zinc-300">
                                                <div className="flex items-center gap-1 text-green-500 mb-1 font-semibold">
                                                    <Sparkles className="h-3 w-3" /> AI Summary
                                                </div>
                                                {videoSummaries[video.id]}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 3: Interactive Quiz */}
                <section>
                    <Card className="bg-gradient-to-r from-green-900/20 to-zinc-900 border-green-500/30">
                        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <HelpCircle className="h-6 w-6 text-green-500" />
                                    Cyber Safety Challenge
                                </h3>
                                <p className="text-zinc-400">Test your knowledge and earn your Cyber Guardian badge!</p>
                            </div>
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setQuizOpen(true)}>
                                Take the Quiz
                            </Button>
                        </CardContent>
                    </Card>
                </section>

            </main>

            {/* Case Study Modal */}
            <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-green-500">{selectedCase?.title}</DialogTitle>
                        <DialogDescription className="text-zinc-400">Category: {selectedCase?.category}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                        <p className="text-zinc-300 leading-relaxed">{selectedCase?.fullStory}</p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg">
                                <h4 className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                                    <AlertTriangle className="h-4 w-4" /> Potential Risks
                                </h4>
                                <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
                                    {selectedCase?.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                                </ul>
                            </div>
                            <div className="bg-green-900/20 border border-green-900/50 p-4 rounded-lg">
                                <h4 className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                                    <Shield className="h-4 w-4" /> How to Protect
                                </h4>
                                <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
                                    {selectedCase?.protection.map((tip, i) => <li key={i}>{tip}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-zinc-800 p-4 rounded-lg">
                            <span className="font-semibold text-white">Outcome: </span>
                            <span className="text-zinc-300">{selectedCase?.outcome}</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Quiz Modal */}
            <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
                    {!showResult ? (
                        <>
                            <DialogHeader>
                                <DialogTitle>Question {currentQuestion + 1}/{quizQuestions.length}</DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <p className="text-lg font-medium">{quizQuestions[currentQuestion].question}</p>
                                <div className="grid gap-2">
                                    {quizQuestions[currentQuestion].options.map((option, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            className="justify-start text-left h-auto py-3 border-zinc-700 hover:bg-zinc-800 hover:text-white"
                                            onClick={() => handleQuizAnswer(index)}
                                            disabled={!!quizFeedback}
                                        >
                                            {option}
                                        </Button>
                                    ))}
                                </div>
                                {quizFeedback && (
                                    <div className={`text-center font-bold text-lg animate-pulse ${quizFeedback.includes("Correct") ? "text-green-500" : "text-red-500"}`}>
                                        {quizFeedback}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 space-y-4">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                            <h2 className="text-2xl font-bold">Quiz Completed!</h2>
                            <p className="text-xl">Your Score: <span className="text-green-500">{score}/{quizQuestions.length}</span></p>
                            <Button onClick={resetQuiz} className="bg-green-600 hover:bg-green-700">Close</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
